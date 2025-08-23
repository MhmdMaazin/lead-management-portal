import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// MongoDB connection
let client
let db

async function connectToMongo() {
  try {
    if (!client || !client.topology || !client.topology.isConnected()) {
      console.log('Connecting to MongoDB...')
      client = new MongoClient(process.env.MONGO_URL, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      await client.connect()
      db = client.db(process.env.DB_NAME)
      console.log('MongoDB connected successfully')
    }
    return db
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error(`Failed to connect to MongoDB: ${error.message}`)
  }
}

// Initialize admin user and default data
async function initializeAdminUser() {
  try {
    const db = await connectToMongo()
    
    // Check if admin user exists
    const adminUser = await db.collection('admin_users').findOne({ email: 'admin@gmail.com' })
    
    if (!adminUser) {
      // Create admin user
      const hashedPassword = crypto.createHash('sha256').update('12345678').digest('hex')
      
      await db.collection('admin_users').insertOne({
        id: uuidv4(),
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      console.log('Admin user created: admin@gmail.com / 12345678')
    }

    // Initialize default categories
    const defaultCategories = [
      'Residential', 'Commercial', 'Industrial', 'Institutional', 'Infrastructure', 'Landscaping', 'Interior Fit-out', 'environmental', 'uninhabitable'
    ]
    
    for (const categoryName of defaultCategories) {
      const existing = await db.collection('categories').findOne({ name: categoryName })
      if (!existing) {
        await db.collection('categories').insertOne({
          id: uuidv4(),
          name: categoryName,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    // Initialize default phases
    const defaultPhases = [
      'Design', 'Planning', 'Permitting', 'Construction', 'Completion', 'Maintenance'
    ]
    for (const phaseName of defaultPhases) {
      const existing = await db.collection('phases').findOne({ name: phaseName })
      if (!existing) {
        await db.collection('phases').insertOne({
          id: uuidv4(),
          name: phaseName,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    // Initialize default project types
    const defaultProjectTypes = [
      'New Building', 'Renovation', 'Demolition', 'Addition', 'Infrastructure', 'Landscaping', 'Interior Fit-out'
    ]
    for (const typeName of defaultProjectTypes) {
      const existing = await db.collection('project_types').findOne({ name: typeName })
      if (!existing) {
        await db.collection('project_types').insertOne({
          id: uuidv4(),
          name: typeName,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    // Initialize default statuses
    const defaultStatuses = [
      'Pending', 'Under Review', 'In Progress', 'Approved'
    ]
    for (const statusName of defaultStatuses) {
      const existing = await db.collection('statuses').findOne({ name: statusName })
      if (!existing) {
        await db.collection('statuses').insertOne({
          id: uuidv4(),
          name: statusName,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    // Initialize default municipalities
    const defaultMunicipalities = [
      'Vancouver', 'Richmond', 'Burnaby', 'Surrey', 'Coquitlam', 
      'New Westminster', 'Delta', 'Langley', 'Maple Ridge', 
      'Port Coquitlam', 'Port Moody', 'White Rock'
    ]
    
    for (const municipalityName of defaultMunicipalities) {
      const existing = await db.collection('municipalities').findOne({ name: municipalityName })
      if (!existing) {
        await db.collection('municipalities').insertOne({
          id: uuidv4(),
          name: municipalityName,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }

    // Initialize default regions
    const defaultRegions = [
      'BC-West', 'BC-Central', 'BC-South', 'BC-East', 'BC-North', 'BC-Island', 'BC-Interior'
    ]
    
    for (const regionName of defaultRegions) {
      const existing = await db.collection('regions').findOne({ name: regionName })
      if (!existing) {
        await db.collection('regions').insertOne({
          id: uuidv4(),
          name: regionName,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    
    console.log('Database initialization completed')
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Call initialization
initializeAdminUser().catch(console.error)

// Generate JWT token (simple implementation)
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    timestamp: Date.now()
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

// Verify JWT token
function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    // Check if token is not older than 24 hours
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    if (Date.now() - payload.timestamp > maxAge) {
      return null
    }
    return payload
  } catch (error) {
    return null
  }
}

// Hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // Ensure database connection is established
    const db = await connectToMongo()
    if (!db) {
      throw new Error('Failed to establish database connection')
    }

    // Authentication endpoints
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body
      
      if (!email || !password) {
        return handleCORS(NextResponse.json(
          { error: "Email and password are required" }, 
          { status: 400 }
        ))
      }
      
      // Hash the provided password
      const hashedPassword = hashPassword(password)
      
      // Find admin user
      const adminUser = await db.collection('admin_users').findOne({ 
        email: email.toLowerCase(),
        password: hashedPassword
      })
      
      if (!adminUser) {
        return handleCORS(NextResponse.json(
          { error: "Invalid credentials" }, 
          { status: 401 }
        ))
      }
      
      // Generate token
      const token = generateToken(adminUser)
      
      // Return success response
      return handleCORS(NextResponse.json({
        token,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role
        }
      }))
    }
    
    if (route === '/auth/verify' && method === 'GET') {
      const authHeader = request.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return handleCORS(NextResponse.json(
          { error: "No token provided" }, 
          { status: 401 }
        ))
      }
      
      const token = authHeader.substring(7)
      const payload = verifyToken(token)
      
      if (!payload) {
        return handleCORS(NextResponse.json(
          { error: "Invalid token" }, 
          { status: 401 }
        ))
      }
      
      // Verify user still exists
      const adminUser = await db.collection('admin_users').findOne({ 
        id: payload.id 
      })
      
      if (!adminUser) {
        return handleCORS(NextResponse.json(
          { error: "User not found" }, 
          { status: 401 }
        ))
      }
      
      return handleCORS(NextResponse.json({
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role
        }
      }))
    }

    // Root endpoint
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Lead Management Portal API" }))
    }

    // Leads endpoints
    if (route === '/leads' && method === 'GET') {
      const leads = await db.collection('leads')
        .find({})
        .limit(1000)
        .toArray()
      
      const cleanedLeads = leads.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedLeads))
    }

    if (route === '/leads' && method === 'POST') {
      const body = await request.json()
      
      const lead = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await db.collection('leads').insertOne(lead)
      const { _id, ...cleanedLead } = lead
      return handleCORS(NextResponse.json(cleanedLead))
    }

    if (route.startsWith('/leads/') && method === 'GET') {
      const leadId = route.split('/')[2]
      const lead = await db.collection('leads').findOne({ id: leadId })
      
      if (!lead) {
        return handleCORS(NextResponse.json(
          { error: "Lead not found" }, 
          { status: 404 }
        ))
      }

      const { _id, ...cleanedLead } = lead
      return handleCORS(NextResponse.json(cleanedLead))
    }

    if (route.startsWith('/leads/') && method === 'PUT') {
      const leadId = route.split('/')[2]
      const body = await request.json()
      
      const updateResult = await db.collection('leads').updateOne(
        { id: leadId },
        { 
          $set: { 
            ...body, 
            updatedAt: new Date() 
          } 
        }
      )

      if (updateResult.matchedCount === 0) {
        return handleCORS(NextResponse.json(
          { error: "Lead not found" }, 
          { status: 404 }
        ))
      }

      const updatedLead = await db.collection('leads').findOne({ id: leadId })
      const { _id, ...cleanedLead } = updatedLead
      return handleCORS(NextResponse.json(cleanedLead))
    }

    if (route.startsWith('/leads/') && method === 'DELETE') {
      const leadId = route.split('/')[2]
      
      const deleteResult = await db.collection('leads').deleteOne({ id: leadId })
      
      if (deleteResult.deletedCount === 0) {
        return handleCORS(NextResponse.json(
          { error: "Lead not found" }, 
          { status: 404 }
        ))
      }

      return handleCORS(NextResponse.json({ message: "Lead deleted successfully" }))
    }

    // Saved leads endpoints
    if (route === '/saved-leads' && method === 'GET') {
      const savedLeads = await db.collection('saved_leads')
        .find({})
        .toArray()
      
      const cleanedSavedLeads = savedLeads.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedSavedLeads))
    }

    if (route === '/saved-leads' && method === 'POST') {
      const body = await request.json()
      
      const savedLead = {
        id: uuidv4(),
        leadId: body.leadId,
        userId: body.userId || 'default-user',
        createdAt: new Date()
      }

      await db.collection('saved_leads').insertOne(savedLead)
      const { _id, ...cleanedSavedLead } = savedLead
      return handleCORS(NextResponse.json(cleanedSavedLead))
    }

    if (route.startsWith('/saved-leads/') && method === 'DELETE') {
      const leadId = route.split('/')[2]
      
      const deleteResult = await db.collection('saved_leads').deleteOne({ 
        leadId: leadId 
      })
      
      return handleCORS(NextResponse.json({ 
        message: "Saved lead removed successfully",
        deleted: deleteResult.deletedCount > 0
      }))
    }

    // Prospection leads endpoints
    if (route === '/prospection-leads' && method === 'GET') {
      const prospectionLeads = await db.collection('prospection_leads')
        .find({})
        .toArray()
      
      const cleanedProspectionLeads = prospectionLeads.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedProspectionLeads))
    }

    if (route === '/prospection-leads' && method === 'POST') {
      const body = await request.json()
      
      const prospectionLead = {
        id: uuidv4(),
        leadId: body.leadId,
        userId: body.userId || 'default-user',
        createdAt: new Date()
      }

      await db.collection('prospection_leads').insertOne(prospectionLead)
      const { _id, ...cleanedProspectionLead } = prospectionLead
      return handleCORS(NextResponse.json(cleanedProspectionLead))
    }

    if (route.startsWith('/prospection-leads/') && method === 'DELETE') {
      const leadId = route.split('/')[2]
      
      const deleteResult = await db.collection('prospection_leads').deleteOne({ 
        leadId: leadId 
      })
      
      return handleCORS(NextResponse.json({ 
        message: "Prospection lead removed successfully",
        deleted: deleteResult.deletedCount > 0
      }))
    }

    // Contact history endpoints
    if (route === '/contact-history' && method === 'GET') {
      const contactHistory = await db.collection('contact_history')
        .find({})
        .sort({ timestamp: -1 })
        .limit(100)
        .toArray()
      
      const cleanedContactHistory = contactHistory.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedContactHistory))
    }

    if (route === '/contact-history' && method === 'POST') {
      const body = await request.json()
      
      const contactRecord = {
        id: uuidv4(),
        leadId: body.leadId,
        type: body.type, // 'email' or 'postal'
        recipient: body.recipient,
        subject: body.subject,
        content: body.content,
        status: body.status || 'sent',
        timestamp: new Date(),
        userId: body.userId || 'default-user'
      }

      await db.collection('contact_history').insertOne(contactRecord)
      const { _id, ...cleanedContactRecord } = contactRecord
      return handleCORS(NextResponse.json(cleanedContactRecord))
    }

    // Email sending endpoint (placeholder)
    if (route === '/send-email' && method === 'POST') {
      const body = await request.json()
      
      // In a real implementation, you would integrate with SendGrid here
      // For now, we'll just log the email and return success
      console.log('Email would be sent:', body)
      
      const emailRecord = {
        id: uuidv4(),
        to: body.to,
        subject: body.subject,
        content: body.content,
        status: 'sent',
        timestamp: new Date()
      }

      await db.collection('emails').insertOne(emailRecord)
      const { _id, ...cleanedEmailRecord } = emailRecord
      return handleCORS(NextResponse.json(cleanedEmailRecord))
    }

    // Postal mail sending endpoint (placeholder)
    if (route === '/send-mail' && method === 'POST') {
      const body = await request.json()
      
      // In a real implementation, you would integrate with a postal service here
      console.log('Postal mail would be sent:', body)
      
      const mailRecord = {
        id: uuidv4(),
        to: body.to,
        content: body.content,
        status: 'scheduled',
        timestamp: new Date()
      }

      await db.collection('postal_mail').insertOne(mailRecord)
      const { _id, ...cleanedMailRecord } = mailRecord
      return handleCORS(NextResponse.json(cleanedMailRecord))
    }

    // Phases endpoints
    if (route === '/phases' && method === 'GET') {
      const phases = await db.collection('phases')
        .find({})
        .sort({ name: 1 })
        .toArray()
      const cleanedPhases = phases.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedPhases))
    }
    if (route === '/phases' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.name.trim()) {
        return handleCORS(NextResponse.json(
          { error: "Phase name is required" },
          { status: 400 }
        ))
      }
      const existing = await db.collection('phases').findOne({ name: body.name.trim() })
      if (existing) {
        return handleCORS(NextResponse.json(
          { error: "Phase already exists" },
          { status: 409 }
        ))
      }
      const phase = {
        id: uuidv4(),
        name: body.name.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('phases').insertOne(phase)
      const { _id, ...cleaned } = phase
      return handleCORS(NextResponse.json(cleaned))
    }
    if (route.startsWith('/phases/') && method === 'DELETE') {
      const phaseId = route.split('/')[2]
      const deleteResult = await db.collection('phases').deleteOne({ id: phaseId })
      if (deleteResult.deletedCount === 0) {
        return handleCORS(NextResponse.json(
          { error: "Phase not found" },
          { status: 404 }
        ))
      }
      return handleCORS(NextResponse.json({ message: "Phase deleted successfully" }))
    }

    // Project Types endpoints
    if (route === '/project-types' && method === 'GET') {
      const projectTypes = await db.collection('project_types')
        .find({})
        .sort({ name: 1 })
        .toArray()
      const cleanedProjectTypes = projectTypes.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedProjectTypes))
    }
    if (route === '/project-types' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.name.trim()) {
        return handleCORS(NextResponse.json(
          { error: "Project type name is required" },
          { status: 400 }
        ))
      }
      const existing = await db.collection('project_types').findOne({ name: body.name.trim() })
      if (existing) {
        return handleCORS(NextResponse.json(
          { error: "Project type already exists" },
          { status: 409 }
        ))
      }
      const projectType = {
        id: uuidv4(),
        name: body.name.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('project_types').insertOne(projectType)
      const { _id, ...cleaned } = projectType
      return handleCORS(NextResponse.json(cleaned))
    }
    if (route.startsWith('/project-types/') && method === 'DELETE') {
      const projectTypeId = route.split('/')[2]
      const deleteResult = await db.collection('project_types').deleteOne({ id: projectTypeId })
      if (deleteResult.deletedCount === 0) {
        return handleCORS(NextResponse.json(
          { error: "Project type not found" },
          { status: 404 }
        ))
      }
      return handleCORS(NextResponse.json({ message: "Project type deleted successfully" }))
    }

    // Statuses endpoints
    if (route === '/statuses' && method === 'GET') {
      const statuses = await db.collection('statuses')
        .find({})
        .sort({ name: 1 })
        .toArray()
      const cleanedStatuses = statuses.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedStatuses))
    }
    if (route === '/statuses' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.name.trim()) {
        return handleCORS(NextResponse.json(
          { error: "Status name is required" },
          { status: 400 }
        ))
      }
      const existing = await db.collection('statuses').findOne({ name: body.name.trim() })
      if (existing) {
        return handleCORS(NextResponse.json(
          { error: "Status already exists" },
          { status: 409 }
        ))
      }
      const status = {
        id: uuidv4(),
        name: body.name.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('statuses').insertOne(status)
      const { _id, ...cleaned } = status
      return handleCORS(NextResponse.json(cleaned))
    }
    if (route.startsWith('/statuses/') && method === 'DELETE') {
      const statusId = route.split('/')[2]
      const deleteResult = await db.collection('statuses').deleteOne({ id: statusId })
      if (deleteResult.deletedCount === 0) {
        return handleCORS(NextResponse.json(
          { error: "Status not found" },
          { status: 404 }
        ))
      }
      return handleCORS(NextResponse.json({ message: "Status deleted successfully" }))
    }

    // Categories endpoints
    if (route === '/categories' && method === 'GET') {
      const categories = await db.collection('categories')
        .find({})
        .sort({ name: 1 })
        .toArray()
      const cleanedCategories = categories.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedCategories))
    }
    if (route === '/categories' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.name.trim()) {
        return handleCORS(NextResponse.json(
          { error: "Category name is required" },
          { status: 400 }
        ))
      }
      const existing = await db.collection('categories').findOne({ name: body.name.trim() })
      if (existing) {
        return handleCORS(NextResponse.json(
          { error: "Category already exists" },
          { status: 409 }
        ))
      }
      const category = {
        id: uuidv4(),
        name: body.name.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('categories').insertOne(category)
      const { _id, ...cleaned } = category
      return handleCORS(NextResponse.json(cleaned))
    }
    if (route.startsWith('/categories/') && method === 'DELETE') {
      const categoryId = route.split('/')[2]
      const deleteResult = await db.collection('categories').deleteOne({ id: categoryId })
      if (deleteResult.deletedCount === 0) {
        return handleCORS(NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        ))
      }
      return handleCORS(NextResponse.json({ message: "Category deleted successfully" }))
    }

    // Municipalities endpoints
    if (route === '/municipalities' && method === 'GET') {
      const municipalities = await db.collection('municipalities')
        .find({})
        .sort({ name: 1 })
        .toArray()
      const cleanedMunicipalities = municipalities.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedMunicipalities))
    }
    if (route === '/municipalities' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.name.trim()) {
        return handleCORS(NextResponse.json(
          { error: "Municipality name is required" },
          { status: 400 }
        ))
      }
      const existing = await db.collection('municipalities').findOne({ name: body.name.trim() })
      if (existing) {
        return handleCORS(NextResponse.json(
          { error: "Municipality already exists" },
          { status: 409 }
        ))
      }
      const municipality = {
        id: uuidv4(),
        name: body.name.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('municipalities').insertOne(municipality)
      const { _id, ...cleaned } = municipality
      return handleCORS(NextResponse.json(cleaned))
    }
    if (route.startsWith('/municipalities/') && method === 'DELETE') {
      const municipalityId = route.split('/')[2]
      const deleteResult = await db.collection('municipalities').deleteOne({ id: municipalityId })
      if (deleteResult.deletedCount === 0) {
        return handleCORS(NextResponse.json(
          { error: "Municipality not found" },
          { status: 404 }
        ))
      }
      return handleCORS(NextResponse.json({ message: "Municipality deleted successfully" }))
    }

    // Regions endpoints
    if (route === '/regions' && method === 'GET') {
      const regions = await db.collection('regions')
        .find({})
        .sort({ name: 1 })
        .toArray()
      const cleanedRegions = regions.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedRegions))
    }
    if (route === '/regions' && method === 'POST') {
      const body = await request.json()
      if (!body.name || !body.name.trim()) {
        return handleCORS(NextResponse.json(
          { error: "Region name is required" },
          { status: 400 }
        ))
      }
      const existing = await db.collection('regions').findOne({ name: body.name.trim() })
      if (existing) {
        return handleCORS(NextResponse.json(
          { error: "Region already exists" },
          { status: 409 }
        ))
      }
      const region = {
        id: uuidv4(),
        name: body.name.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('regions').insertOne(region)
      const { _id, ...cleaned } = region
      return handleCORS(NextResponse.json(cleaned))
    }
    if (route.startsWith('/regions/') && method === 'DELETE') {
      const regionId = route.split('/')[2]
      const deleteResult = await db.collection('regions').deleteOne({ id: regionId })
      if (deleteResult.deletedCount === 0) {
        return handleCORS(NextResponse.json(
          { error: "Region not found" },
          { status: 404 }
        ))
      }
      return handleCORS(NextResponse.json({ message: "Region deleted successfully" }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
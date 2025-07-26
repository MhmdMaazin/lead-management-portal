'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  MapPin, Mail, Phone, Calendar, Star, StarOff, Send, FileText, Search, Filter, Eye, Heart, MessageSquare, 
  Home, Users, Trash2, Settings, Bell, Plus, Edit, Building, TreePine, AlertTriangle
} from 'lucide-react'

export default function App() {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [municipalityFilter, setMunicipalityFilter] = useState('all')
  const [savedLeads, setSavedLeads] = useState([])
  const [prospectionLeads, setProspectionLeads] = useState([])
  const [activeSection, setActiveSection] = useState('inbox')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [emailContent, setEmailContent] = useState('')
  const [contactHistory, setContactHistory] = useState([])
  const [selectedLeads, setSelectedLeads] = useState([])

  // Mock data for leads
  const mockLeads = [
    {
      id: '1',
      title: 'Environmental Permit - New Construction',
      category: 'environmental',
      type: 'New Building',
      address: '123 Oak Street, Downtown',
      municipality: 'Vancouver',
      owner: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      description: 'New 3-story residential building with underground parking and green roof system.',
      applicationDate: '2024-06-15',
      projectValue: '$2.5M',
      status: 'Under Review',
      architect: 'Green Design Associates',
      contractor: 'BuildRight Construction'
    },
    {
      id: '2',
      title: 'Uninhabitable Dwelling - Renovation Required',
      category: 'uninhabitable',
      type: 'Renovation',
      address: '456 Pine Avenue, Eastside',
      municipality: 'Vancouver',
      owner: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 987-6543',
      description: 'Historic home requiring extensive renovation, structural repairs, and modernization.',
      applicationDate: '2024-06-10',
      projectValue: '$450K',
      status: 'Approved',
      architect: 'Heritage Restorations',
      contractor: null
    },
    {
      id: '3',
      title: 'Environmental Permit - Industrial Site',
      category: 'environmental',
      type: 'Industrial',
      address: '789 Industrial Way, Port Area',
      municipality: 'Richmond',
      owner: 'TechCorp Industries',
      email: 'permits@techcorp.com',
      phone: '+1 (555) 555-0123',
      description: 'New manufacturing facility with environmental compliance requirements.',
      applicationDate: '2024-06-12',
      projectValue: '$5.2M',
      status: 'In Progress',
      architect: 'Industrial Design Solutions',
      contractor: 'MegaBuild Corp'
    },
    {
      id: '4',
      title: 'Uninhabitable Dwelling - Fire Damage',
      category: 'uninhabitable',
      type: 'Restoration',
      address: '321 Maple Road, Westside',
      municipality: 'Burnaby',
      owner: 'Michael Brown',
      email: 'mbrown@email.com',
      phone: '+1 (555) 444-7890',
      description: 'Single-family home requiring complete restoration after fire damage.',
      applicationDate: '2024-06-08',
      projectValue: '$650K',
      status: 'Pending',
      architect: 'Phoenix Restoration',
      contractor: null
    }
  ]

  useEffect(() => {
    setLeads(mockLeads)
    setFilteredLeads(mockLeads)
  }, [])

  useEffect(() => {
    let filtered = leads

    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(lead => lead.category === categoryFilter)
    }

    if (municipalityFilter !== 'all') {
      filtered = filtered.filter(lead => lead.municipality === municipalityFilter)
    }

    setFilteredLeads(filtered)
  }, [searchTerm, categoryFilter, municipalityFilter, leads])

  const handleSaveLead = (leadId) => {
    if (savedLeads.includes(leadId)) {
      setSavedLeads(savedLeads.filter(id => id !== leadId))
    } else {
      setSavedLeads([...savedLeads, leadId])
    }
  }

  const handleProspectionLead = (leadId) => {
    if (prospectionLeads.includes(leadId)) {
      setProspectionLeads(prospectionLeads.filter(id => id !== leadId))
    } else {
      setProspectionLeads([...prospectionLeads, leadId])
    }
  }

  const handleSendEmail = (lead) => {
    const emailRecord = {
      id: Date.now().toString(),
      leadId: lead.id,
      type: 'email',
      recipient: lead.email,
      subject: `Project Inquiry - ${lead.title}`,
      content: emailContent,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    setContactHistory([...contactHistory, emailRecord])
    setEmailContent('')
    alert('Email sent successfully!')
  }

  const handleSendMail = (lead) => {
    const mailRecord = {
      id: Date.now().toString(),
      leadId: lead.id,
      type: 'postal',
      recipient: lead.address,
      content: 'Marketing flyer',
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    setContactHistory([...contactHistory, mailRecord])
    alert('Postal mail scheduled for delivery!')
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'environmental':
        return 'bg-green-100 text-green-800'
      case 'uninhabitable':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Under Review':
        return 'bg-blue-100 text-blue-800'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const municipalities = [...new Set(leads.map(lead => lead.municipality))]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Lead Management Portal</h1>
              <p className="text-muted-foreground">Manage and track your project leads</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {savedLeads.length} Saved
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {prospectionLeads.length} Prospection
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedLeads.length})</TabsTrigger>
            <TabsTrigger value="prospection">Prospection ({prospectionLeads.length})</TabsTrigger>
            <TabsTrigger value="history">Contact History</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="environmental">Environmental Permits</SelectItem>
                      <SelectItem value="uninhabitable">Uninhabitable Dwellings</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={municipalityFilter} onValueChange={setMunicipalityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Municipalities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Municipalities</SelectItem>
                      {municipalities.map(municipality => (
                        <SelectItem key={municipality} value={municipality}>
                          {municipality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setCategoryFilter('all')
                      setMunicipalityFilter('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map(lead => (
                <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{lead.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {lead.address}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={savedLeads.includes(lead.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSaveLead(lead.id)}
                        >
                          {savedLeads.includes(lead.id) ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant={prospectionLeads.includes(lead.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleProspectionLead(lead.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getCategoryColor(lead.category)}>
                          {lead.category === 'environmental' ? 'Environmental' : 'Uninhabitable'}
                        </Badge>
                        <Badge variant="outline">{lead.type}</Badge>
                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(lead.applicationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Owner:</span>
                          <span>{lead.owner}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Value:</span>
                          <span>{lead.projectValue}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lead.description}
                      </p>
                      
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLead(lead)
                            setIsDetailOpen(true)
                          }}
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLeads.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No leads found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Leads</CardTitle>
                <CardDescription>Leads you've marked as favorites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leads.filter(lead => savedLeads.includes(lead.id)).map(lead => (
                    <Card key={lead.id} className="p-4">
                      <h4 className="font-medium">{lead.title}</h4>
                      <p className="text-sm text-muted-foreground">{lead.address}</p>
                      <Badge className={getCategoryColor(lead.category)} size="sm">
                        {lead.category}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prospection">
            <Card>
              <CardHeader>
                <CardTitle>Prospection List</CardTitle>
                <CardDescription>Leads you're actively pursuing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leads.filter(lead => prospectionLeads.includes(lead.id)).map(lead => (
                    <Card key={lead.id} className="p-4">
                      <h4 className="font-medium">{lead.title}</h4>
                      <p className="text-sm text-muted-foreground">{lead.address}</p>
                      <p className="text-sm text-muted-foreground">{lead.owner}</p>
                      <Badge className={getCategoryColor(lead.category)} size="sm">
                        {lead.category}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Contact History</CardTitle>
                <CardDescription>Record of all your communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactHistory.map(record => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {record.type === 'email' ? <Mail className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          <span className="font-medium">{record.type === 'email' ? 'Email' : 'Postal Mail'}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-2">To: {record.recipient}</p>
                      <Badge variant="outline" className="mt-2">{record.status}</Badge>
                    </div>
                  ))}
                  {contactHistory.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No contact history yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLead.title}</DialogTitle>
                <DialogDescription>
                  Detailed information about this lead
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>{selectedLead.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedLead.status)}>{selectedLead.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Value:</span>
                        <span>{selectedLead.projectValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Application Date:</span>
                        <span>{new Date(selectedLead.applicationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedLead.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Municipality:</span>
                        <span>{selectedLead.municipality}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        View on Google Street View
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedLead.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Owner:</span>
                        <span>{selectedLead.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedLead.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Team</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Architect:</span>
                        <span>{selectedLead.architect || 'Not assigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contractor:</span>
                        <span>{selectedLead.contractor || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contact Actions</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email-content">Email Message</Label>
                        <Textarea
                          id="email-content"
                          placeholder="Write your message here..."
                          value={emailContent}
                          onChange={(e) => setEmailContent(e.target.value)}
                          className="mt-2"
                        />
                        <Button 
                          className="w-full mt-2"
                          onClick={() => handleSendEmail(selectedLead)}
                          disabled={!emailContent.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleSendMail(selectedLead)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Send Postal Mail
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
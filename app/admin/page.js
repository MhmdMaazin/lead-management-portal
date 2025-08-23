'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, Edit, Trash2, Eye, Settings, Database, Users, FileText, Mail, Phone, MapPin, Calendar, Building, TreePine, AlertTriangle, Save, X, LogOut, Home, Factory, GraduationCap, Road, Paintbrush
} from 'lucide-react'

function LeadForm({ formData, setFormData, onSubmit, submitText, onCancel, phases, projectTypes, statuses, categories, municipalities, regions, setIsAddDropdownOpen, setDropdownType, confirmDelete }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => {
            if (value === 'add-new-category') {
              setDropdownType('categories');
              setIsAddDropdownOpen(true);
            } else {
              setFormData({ ...formData, category: value })
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent">
                  <SelectItem value={category.name} className="flex-1">
                    {category.name}
                  </SelectItem>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmDelete('categories', category);
                    }}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <SelectItem value="add-new-category" className="text-blue-600 font-medium">
                + Add New Category
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="phase">Phase</Label>
          <Select value={formData.phase} onValueChange={(value) => {
            if (value === 'add-new-phase') {
              setDropdownType('phases');
              setIsAddDropdownOpen(true);
            } else {
              setFormData({ ...formData, phase: value })
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select phase" />
            </SelectTrigger>
            <SelectContent>
              {phases.map(phase => (
                <div key={phase.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent">
                  <SelectItem value={phase.name} className="flex-1">
                    {phase.name}
                  </SelectItem>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmDelete('phases', phase);
                    }}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <SelectItem value="add-new-phase" className="text-blue-600 font-medium">
                + Add New Phase
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="type">Project Type</Label>
          <Select value={formData.type} onValueChange={(value) => {
            if (value === 'add-new-project-type') {
              setDropdownType('project-types');
              setIsAddDropdownOpen(true);
            } else {
              setFormData({ ...formData, type: value })
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map(type => (
                <div key={type.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent">
                  <SelectItem value={type.name} className="flex-1">
                    {type.name}
                  </SelectItem>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmDelete('project-types', type);
                    }}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <SelectItem value="add-new-project-type" className="text-blue-600 font-medium">
                + Add New Project Type
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="municipality">Municipality</Label>
          <Select value={formData.municipality} onValueChange={(value) => {
            if (value === 'add-new-municipality') {
              setDropdownType('municipalities');
              setIsAddDropdownOpen(true);
            } else {
              setFormData({ ...formData, municipality: value })
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select municipality" />
            </SelectTrigger>
            <SelectContent>
              {municipalities.map(municipality => (
                <div key={municipality.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent">
                  <SelectItem value={municipality.name} className="flex-1">
                    {municipality.name}
                  </SelectItem>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmDelete('municipalities', municipality);
                    }}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <SelectItem value="add-new-municipality" className="text-blue-600 font-medium">
                + Add New Municipality
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Select value={formData.region} onValueChange={(value) => {
            if (value === 'add-new-region') {
              setDropdownType('regions');
              setIsAddDropdownOpen(true);
            } else {
              setFormData({ ...formData, region: value })
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <div key={region.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent">
                  <SelectItem value={region.name} className="flex-1">
                    {region.name}
                  </SelectItem>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmDelete('regions', region);
                    }}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <SelectItem value="add-new-region" className="text-blue-600 font-medium">
                + Add New Region
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="applicationDate">Application Date</Label>
          <Input
            id="applicationDate"
            type="date"
            value={formData.applicationDate}
            onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="publicationDate">Publication Date</Label>
          <Input
            id="publicationDate"
            type="date"
            value={formData.publicationDate}
            onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="projectValue">Project Value</Label>
          <Input
            id="projectValue"
            value={formData.projectValue}
            onChange={(e) => setFormData({ ...formData, projectValue: e.target.value })}
            placeholder="e.g., $2.5M"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => {
            if (value === 'add-new-status') {
              setDropdownType('statuses');
              setIsAddDropdownOpen(true);
            } else {
              setFormData({ ...formData, status: value })
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <div key={status.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent">
                  <SelectItem value={status.name} className="flex-1">
                    {status.name}
                  </SelectItem>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      confirmDelete('statuses', status);
                    }}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <SelectItem value="add-new-status" className="text-blue-600 font-medium">
                + Add New Status
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="architect">Architect</Label>
          <Input
            id="architect"
            value={formData.architect}
            onChange={(e) => setFormData({ ...formData, architect: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="contractor">Contractor</Label>
          <Input
            id="contractor"
            value={formData.contractor}
            onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {submitText}
        </Button>
      </div>
    </form>
  )
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [phases, setPhases] = useState([])
  const [projectTypes, setProjectTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [categories, setCategories] = useState([])
  const [municipalities, setMunicipalities] = useState([])
  const [regions, setRegions] = useState([])
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false)
  const [dropdownType, setDropdownType] = useState('')
  const [newDropdownValue, setNewDropdownValue] = useState('')
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    phase: '',
    type: '',
    address: '',
    municipality: '',
    region: '',
    owner: '',
    email: '',
    phone: '',
    description: '',
    applicationDate: '',
    publicationDate: '',
    projectValue: '',
    status: '',
    architect: '',
    contractor: ''
  })

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const user = localStorage.getItem('adminUser')
      
      if (!token || !user) {
        router.push('/admin/login')
        return
      }

      // Verify token with backend
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setAdminUser(JSON.parse(user))
        await fetchLeads()
      } else {
        // Token is invalid, redirect to login
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/admin/login')
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchDropdowns()
      fetchLeads()
    }
  }, [isAuthenticated])

  const fetchDropdowns = async () => {
    try {
      const [phasesRes, projectTypesRes, statusesRes, categoriesRes, municipalitiesRes, regionsRes] = await Promise.all([
        fetch('/api/phases'),
        fetch('/api/project-types'),
        fetch('/api/statuses'),
        fetch('/api/categories'),
        fetch('/api/municipalities'),
        fetch('/api/regions'),
      ])
      if (phasesRes.ok) setPhases(await phasesRes.json())
      if (projectTypesRes.ok) setProjectTypes(await projectTypesRes.json())
      if (statusesRes.ok) setStatuses(await statusesRes.json())
      if (categoriesRes.ok) setCategories(await categoriesRes.json())
      if (municipalitiesRes.ok) setMunicipalities(await municipalitiesRes.json())
      if (regionsRes.ok) setRegions(await regionsRes.json())
    } catch (e) { console.error('Error fetching dropdowns', e) }
  }

  const handleDeleteDropdown = async () => {
    if (!itemToDelete) return
    
    try {
      const res = await fetch(`/api/${itemToDelete.type}/${itemToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        await fetchDropdowns()
        setIsDeleteConfirmOpen(false)
        setItemToDelete(null)
        alert('Item deleted successfully!')
      } else {
        alert('Error deleting item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting item')
    }
  }

  const confirmDelete = (type, item) => {
    setItemToDelete({ type, id: item.id, name: item.name })
    setIsDeleteConfirmOpen(true)
  }

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        await fetchLeads()
        setIsCreateOpen(false)
        resetForm()
        alert('Lead created successfully!')
      }
    } catch (error) {
      console.error('Error creating lead:', error)
      alert('Error creating lead')
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        await fetchLeads()
        setIsEditOpen(false)
        setSelectedLead(null)
        resetForm()
        alert('Lead updated successfully!')
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Error updating lead')
    }
  }

  const handleDelete = async (leadId) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        const response = await fetch(`/api/leads/${leadId}`, {
          method: 'DELETE',
        })
        
        if (response.ok) {
          await fetchLeads()
          alert('Lead deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting lead:', error)
        alert('Error deleting lead')
      }
    }
  }

  const handleAddDropdown = async (e) => {
    e.preventDefault()
    if (!newDropdownValue.trim()) return
    try {
      const res = await fetch(`/api/${dropdownType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDropdownValue.trim() })
      })
      if (res.ok) {
        await fetchDropdowns()
        setFormData({ ...formData, [dropdownType === 'project-types' ? 'type' : dropdownType.slice(0, -1)]: newDropdownValue.trim() })
        setIsAddDropdownOpen(false)
        setNewDropdownValue('')
      }
    } catch (e) { alert('Error adding value') }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: categories.length > 0 ? categories[0].name : '',
      phase: phases.length > 0 ? phases[0].name : '',
      type: projectTypes.length > 0 ? projectTypes[0].name : '',
      address: '',
      municipality: municipalities.length > 0 ? municipalities[0].name : '',
      region: regions.length > 0 ? regions[0].name : '',
      owner: '',
      email: '',
      phone: '',
      description: '',
      applicationDate: '',
      publicationDate: '',
      projectValue: '',
      status: statuses.length > 0 ? statuses[0].name : '',
      architect: '',
      contractor: ''
    })
  }

  const openEditModal = (lead) => {
    setSelectedLead(lead)
    setFormData({
      title: lead.title || '',
      category: lead.category || (categories.length > 0 ? categories[0].name : ''),
      phase: lead.phase || (phases.length > 0 ? phases[0].name : ''),
      type: lead.type || (projectTypes.length > 0 ? projectTypes[0].name : ''),
      address: lead.address || '',
      municipality: lead.municipality || (municipalities.length > 0 ? municipalities[0].name : ''),
      region: lead.region || (regions.length > 0 ? regions[0].name : ''),
      owner: lead.owner || '',
      email: lead.email || '',
      phone: lead.phone || '',
      description: lead.description || '',
      applicationDate: lead.applicationDate || '',
      publicationDate: lead.publicationDate || '',
      projectValue: lead.projectValue || '',
      status: lead.status || (statuses.length > 0 ? statuses[0].name : ''),
      architect: lead.architect || '',
      contractor: lead.contractor || ''
    })
    setIsEditOpen(true)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'environmental':
        return <TreePine className="h-4 w-4 text-green-600" />
      case 'uninhabitable':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'Residential':
        return <Home className="h-4 w-4 text-blue-600" />
      case 'Commercial':
        return <Building className="h-4 w-4 text-purple-600" />
      case 'Industrial':
        return <Factory className="h-4 w-4 text-gray-600" />
      case 'Institutional':
        return <GraduationCap className="h-4 w-4 text-indigo-600" />
      case 'Infrastructure':
        return <Road className="h-4 w-4 text-yellow-600" />
      case 'Landscaping':
        return <TreePine className="h-4 w-4 text-green-600" />
      case 'Interior Fit-out':
        return <Paintbrush className="h-4 w-4 text-pink-600" />
      default:
        return <Building className="h-4 w-4 text-blue-600" />
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
  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect to login)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Backend Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {adminUser?.email || 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Lead
            </Button>
            <Button variant="outline" onClick={() => window.open('/', '_blank')}>
              <Eye className="h-4 w-4 mr-2" />
              View Frontend
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              {categories.length > 0 && getCategoryIcon(categories[0]?.name)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.length > 0 ? categories[0]?.name : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {leads.filter(lead => lead.category === categories[0]?.name).length} projects
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.filter(lead => lead.status === 'Approved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total approved leads
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Region</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {regions.length > 0 ? regions[0]?.name : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {leads.filter(lead => lead.region === regions[0]?.name).length} projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>Manage all project leads from here</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading leads...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.title}</div>
                          <div className="text-sm text-gray-500">{lead.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(lead.category)}
                          <span className="capitalize">{lead.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.owner}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{lead.municipality}</div>
                          <div className="text-gray-500">{lead.region}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.projectValue}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(lead)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(lead.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {!loading && leads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No leads found. Create your first lead to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Lead Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
            <DialogDescription>
              Add a new project lead to the system
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreate}
            submitText="Create Lead"
            onCancel={() => { setIsCreateOpen(false); resetForm(); }}
            phases={phases}
            projectTypes={projectTypes}
            statuses={statuses}
            categories={categories}
            municipalities={municipalities}
            regions={regions}
            setIsAddDropdownOpen={setIsAddDropdownOpen}
            setDropdownType={setDropdownType}
            confirmDelete={confirmDelete}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Lead Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update the lead information
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEdit}
            submitText="Update Lead"
            onCancel={() => { setIsEditOpen(false); setSelectedLead(null); resetForm(); }}
            phases={phases}
            projectTypes={projectTypes}
            statuses={statuses}
            categories={categories}
            municipalities={municipalities}
            regions={regions}
            setIsAddDropdownOpen={setIsAddDropdownOpen}
            setDropdownType={setDropdownType}
            confirmDelete={confirmDelete}
          />
        </DialogContent>
      </Dialog>

      {/* Add Dropdown Modal */}
      <Dialog open={isAddDropdownOpen} onOpenChange={setIsAddDropdownOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{`Add New ${dropdownType.replace('-', ' ').replace(/s$/, '').replace(/\b\w/g, l => l.toUpperCase())}`}</DialogTitle>
            <DialogDescription>{`Add a new ${dropdownType.replace('-', ' ').replace(/s$/, '')} to the system`}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDropdown} className="space-y-4">
            <div>
              <Label htmlFor="new-dropdown">{`${dropdownType.replace('-', ' ').replace(/s$/, '').replace(/\b\w/g, l => l.toUpperCase())} Name`}</Label>
              <Input id="new-dropdown" value={newDropdownValue} onChange={e => setNewDropdownValue(e.target.value)} placeholder={`Enter ${dropdownType.replace('-', ' ').replace(/s$/, '')} name`} required />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddDropdownOpen(false)}>Cancel</Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteDropdown}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
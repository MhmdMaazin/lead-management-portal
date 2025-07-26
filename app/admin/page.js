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
import { 
  Plus, Edit, Trash2, Eye, Settings, Database, Users, FileText, Mail, Phone, MapPin, Calendar, Building, TreePine, AlertTriangle, Save, X
} from 'lucide-react'

export default function AdminDashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'environmental',
    phase: 'Design',
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
    status: 'Pending',
    architect: '',
    contractor: ''
  })

  useEffect(() => {
    fetchLeads()
  }, [])

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

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'environmental',
      phase: 'Design',
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
      status: 'Pending',
      architect: '',
      contractor: ''
    })
  }

  const openEditModal = (lead) => {
    setSelectedLead(lead)
    setFormData({
      title: lead.title || '',
      category: lead.category || 'environmental',
      phase: lead.phase || 'Design',
      type: lead.type || '',
      address: lead.address || '',
      municipality: lead.municipality || '',
      region: lead.region || '',
      owner: lead.owner || '',
      email: lead.email || '',
      phone: lead.phone || '',
      description: lead.description || '',
      applicationDate: lead.applicationDate || '',
      publicationDate: lead.publicationDate || '',
      projectValue: lead.projectValue || '',
      status: lead.status || 'Pending',
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

  const LeadForm = ({ onSubmit, title, submitText }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="uninhabitable">Uninhabitable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="phase">Phase</Label>
          <Input
            id="phase"
            value={formData.phase}
            onChange={(e) => setFormData({...formData, phase: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="type">Project Type</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="municipality">Municipality</Label>
          <Input
            id="municipality"
            value={formData.municipality}
            onChange={(e) => setFormData({...formData, municipality: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            value={formData.region}
            onChange={(e) => setFormData({...formData, region: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => setFormData({...formData, owner: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="applicationDate">Application Date</Label>
          <Input
            id="applicationDate"
            type="date"
            value={formData.applicationDate}
            onChange={(e) => setFormData({...formData, applicationDate: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="publicationDate">Publication Date</Label>
          <Input
            id="publicationDate"
            type="date"
            value={formData.publicationDate}
            onChange={(e) => setFormData({...formData, publicationDate: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="projectValue">Project Value</Label>
          <Input
            id="projectValue"
            value={formData.projectValue}
            onChange={(e) => setFormData({...formData, projectValue: e.target.value})}
            placeholder="e.g., $2.5M"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="architect">Architect</Label>
          <Input
            id="architect"
            value={formData.architect}
            onChange={(e) => setFormData({...formData, architect: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="contractor">Contractor</Label>
          <Input
            id="contractor"
            value={formData.contractor}
            onChange={(e) => setFormData({...formData, contractor: e.target.value})}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          setIsCreateOpen(false)
          setIsEditOpen(false)
          resetForm()
        }}>
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
            <p className="text-gray-600">Manage leads and projects</p>
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
              <CardTitle className="text-sm font-medium">Environmental</CardTitle>
              <TreePine className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.filter(lead => lead.category === 'environmental').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uninhabitable</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leads.filter(lead => lead.category === 'uninhabitable').length}
              </div>
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
          <LeadForm onSubmit={handleCreate} title="Create Lead" submitText="Create Lead" />
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
          <LeadForm onSubmit={handleEdit} title="Edit Lead" submitText="Update Lead" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
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
      title: 'New Construction Project',
      category: 'environmental',
      phase: 'Design',
      type: 'New Building',
      address: '123 Oak Street, Downtown',
      municipality: 'Vancouver',
      region: 'BC-West',
      owner: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      description: 'New 4-story apartment building with underground parking. Eco-friendly design with solar panels and green roof system.',
      applicationDate: '2024-06-15',
      publicationDate: '2024-06-20',
      projectValue: '$2.5M',
      status: 'Under Review',
      architect: 'Green Design Associates',
      contractor: 'BuildRight Construction'
    },
    {
      id: '2',
      title: 'Heritage Building Restoration',
      category: 'uninhabitable',
      phase: 'Design',
      type: 'Renovation',
      address: '456 Pine Avenue, Historic District',
      municipality: 'Vancouver',
      region: 'BC-Central',
      owner: 'HERITAGE INVEST',
      email: 'projects@heritage-invest.com',
      phone: '+1 (555) 987-6543',
      description: 'Complete renovation of historic 1920s building. Restoration of original facade with modern interior updates.',
      applicationDate: '2024-06-10',
      publicationDate: '2024-06-18',
      projectValue: '$1.8M',
      status: 'Approved',
      architect: 'Heritage Restorations',
      contractor: 'Classic Builders'
    },
    {
      id: '3',
      title: 'Industrial Facility Expansion',
      category: 'environmental',
      phase: 'Design',
      type: 'New Building, Demolition',
      address: '789 Industrial Way, Port Area',
      municipality: 'Richmond',
      region: 'BC-South',
      owner: 'AEF Construct',
      email: 'permits@aef-construct.com',
      phone: '+1 (555) 555-0123',
      description: 'Expansion of existing manufacturing facility with new production line and waste management systems.',
      applicationDate: '2024-06-12',
      publicationDate: '2024-06-22',
      projectValue: '$5.2M',
      status: 'In Progress',
      architect: 'Industrial Design Solutions',
      contractor: 'MegaBuild Corp'
    },
    {
      id: '4',
      title: 'Residential Complex Development',
      category: 'environmental',
      phase: 'Design',
      type: 'New Building',
      address: '321 Maple Road, Westside',
      municipality: 'Burnaby',
      region: 'BC-East',
      owner: 'PEETERS-INVEST',
      email: 'development@peeters-invest.com',
      phone: '+1 (555) 444-7890',
      description: 'Development of 20 residential units with integrated community spaces and sustainable infrastructure.',
      applicationDate: '2024-06-08',
      publicationDate: '2024-06-16',
      projectValue: '$8.5M',
      status: 'Pending',
      architect: 'Urban Planning Group',
      contractor: 'Residential Builders Ltd'
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

  const getDataForSection = () => {
    switch (activeSection) {
      case 'favorites':
        return leads.filter(lead => savedLeads.includes(lead.id))
      case 'prospection':
        return leads.filter(lead => prospectionLeads.includes(lead.id))
      case 'trash':
        return []
      default:
        return filteredLeads
    }
  }

  const municipalities = [...new Set(leads.map(lead => lead.municipality))]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold">Lead Portal</h1>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-2">
          <button
            onClick={() => setActiveSection('inbox')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === 'inbox' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            <Home className="h-4 w-4" />
            Inbox
          </button>
          
          <button
            onClick={() => setActiveSection('favorites')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === 'favorites' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            <Star className="h-4 w-4" />
            Favorites
          </button>
          
          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Search Profiles
            </h3>
            <div className="mt-2 space-y-1">
              <div className="px-3 py-2 text-sm text-blue-200">
                No search profiles saved
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              My Search Tasks
            </h3>
            <div className="mt-2 space-y-1">
              <div className="px-3 py-2 text-sm text-blue-200">
                No search tasks saved
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setActiveSection('prospection')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === 'prospection' ? 'bg-green-600 text-white' : 'text-green-200 hover:bg-green-600'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <div>
              <div className="font-medium">Prospection</div>
              <div className="text-xs">email</div>
              <div className="text-xs">postal</div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveSection('trash')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeSection === 'trash' ? 'bg-red-600 text-white' : 'text-red-200 hover:bg-red-600'
            }`}
          >
            <Trash2 className="h-4 w-4" />
            Trash
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {activeSection === 'inbox' ? 'Building Projects' : 
                 activeSection === 'favorites' ? 'Favorite Projects' :
                 activeSection === 'prospection' ? 'Prospection List' : 'Trash'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-gray-500" />
              <div className="text-sm text-gray-500">
                {getDataForSection().length} projects
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects, addresses, owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
                <SelectItem value="uninhabitable">Uninhabitable</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={municipalityFilter} onValueChange={setMunicipalityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {municipalities.map(municipality => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {activeSection === 'inbox' || activeSection === 'favorites' || activeSection === 'prospection' ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Publication Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getDataForSection().map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(lead.category)}
                          {lead.phase}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-blue-600">{lead.type}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <div className="font-medium text-gray-900">{lead.owner}</div>
                          <div className="text-sm text-gray-600 truncate">{lead.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{lead.region}</div>
                          <div className="text-gray-500">{lead.municipality}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(lead.applicationDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(lead.publicationDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveLead(lead.id)}
                            className="h-8 w-8 p-0"
                          >
                            {savedLeads.includes(lead.id) ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProspectionLead(lead.id)}
                            className="h-8 w-8 p-0"
                          >
                            <MessageSquare className={`h-4 w-4 ${
                              prospectionLeads.includes(lead.id) ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLead(lead)
                              setIsDetailOpen(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {getDataForSection().length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No projects found in this section.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center text-gray-500">
                <Trash2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Trash is empty.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedLead.category)}
                  {selectedLead.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedLead.address} • {selectedLead.municipality}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedLead.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phase:</span>
                        <span className="font-medium">{selectedLead.phase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(selectedLead.status)}>{selectedLead.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Project Value:</span>
                        <span className="font-medium">{selectedLead.projectValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application Date:</span>
                        <span>{new Date(selectedLead.applicationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Publication Date:</span>
                        <span>{new Date(selectedLead.publicationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Location</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Municipality:</span>
                        <span>{selectedLead.municipality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Region:</span>
                        <span>{selectedLead.region}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Google Street View
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Description</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedLead.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium">{selectedLead.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedLead.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Project Team</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Architect:</span>
                        <span>{selectedLead.architect || 'Not assigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contractor:</span>
                        <span>{selectedLead.contractor || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Contact Actions</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email-content" className="text-sm font-medium">Email Message</Label>
                        <Textarea
                          id="email-content"
                          placeholder="Write your message here..."
                          value={emailContent}
                          onChange={(e) => setEmailContent(e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                        <Button 
                          className="w-full mt-3"
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
# Lead Management Portal

A React-based lead management portal for managing building project leads with filtering, favorites, prospection, and contact features.

## Features

- Display a list of building project leads with detailed information.
- Search and filter leads by project title, address, owner, description, category, and municipality.
- Mark leads as favorites or add them to a prospection list.
- View detailed lead information in a modal dialog.
- Send email messages or schedule postal mail to leads.
- Sections for Inbox, Favorites, Prospection, and Trash.
- Responsive UI with a sidebar navigation and main content area.

## Technologies Used

- React (with hooks)
- Tailwind CSS (assumed from class names)
- Lucide React icons
- Custom UI components (Button, Card, Input, Select, Dialog, Table, etc.)

## Getting Started

### Prerequisites

- Node.js and npm installed
- Backend API endpoint `/api/leads` to fetch leads data (optional, mock data fallback included)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd lead-management-portal

import './globals.css'

export const metadata = {
  title: 'Lead Management Portal',
  description: 'Manage and track your project leads effectively',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
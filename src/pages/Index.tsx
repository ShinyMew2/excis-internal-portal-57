import { useState } from "react";
import { Search, Mail, Users, FileText, Shield, Calendar, Database, Headphones, Phone, Clock, ScrollText, Cloud, Video, ClipboardList } from "lucide-react";
import PortalHeader from "@/components/PortalHeader";
import AppGrid from "@/components/AppGrid";
import { AppData } from "@/components/AppCard";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Application configuration - easily editable for scalability
  const applications: AppData[] = [
    {
      id: "microsoft-365",
      name: "Microsoft 365",
      description: "Access Word, Excel, PowerPoint, Teams, and more productivity tools",
      url: "https://office.com",
      icon: FileText,
      color: "#1e3a8a", // Excis Navy
      category: "productivity"
    },
    {
      id: "excis-signin",
      name: "Excis Sign",
      description: "Secure document signing platform",
      url: "https://docusign.excis.me",
      icon: Shield,
      color: "#f97316", // Excis Orange
      category: "authentication"
    },
    {
      id: "excis-crm", 
      name: "Excis CRM",
      description: "Customer relationship management and sales pipeline tracking",
      url: "https://crm.zoho.com",
      icon: Users,
      color: "#1e3a8a", // Excis Navy
      category: "business"
    },
    {
      id: "excis-hrms",
      name: "Excis HRMS",
      description: "Human resources management system for employee data and workflows",
      url: "#",
      icon: Database,
      color: "#f97316", // Excis Orange
      category: "hr"
    },
    {
      id: "excis-mail",
      name: "Excis Mail",
      description: "Corporate email platform with advanced security and collaboration",
      url: "https://mail.exc1s.com/",
      icon: Mail,
      color: "#1e3a8a", // Excis Navy
      category: "communication"
    },
    {
      id: "excis-service-desk",
      name: "Excis Service Desk",
      description: "IT support and helpdesk for technical assistance and service requests",
      url: "http://sd.excis.com",
      icon: Headphones,
      color: "#f97316", // Excis Orange
      category: "support"
    },
    {
      id: "excis-voice",
      name: "Excis Voice",
      description: "Voice communication and telephony services for business communications",
      url: "https://voice.zoho.com",
      icon: Phone,
      color: "#1e3a8a", // Excis Navy
      category: "communication"
    },
    {
      id: "excis-shift",
      name: "Excis Shift",
      description: "Employee shift management and scheduling system",
      url: "#",
      icon: Clock,
      color: "#f97316", // Excis Orange
      category: "hr"
    },
    {
      id: "excis-contract",
      name: "Excis Contract",
      description: "Contract management and document security platform",
      url: "https://guard.in.excis.com",
      icon: ScrollText,
      color: "#1e3a8a", // Excis Navy
      category: "business"
    },
    {
      id: "excis-cloud",
      name: "Excis Cloud",
      description: "Cloud storage and file sharing platform for secure document management",
      url: "https://nextcloud.excis.com/",
      icon: Cloud,
      color: "#f97316", // Excis Orange
      category: "productivity"
    },
    {
      id: "excis-meeting",
      name: "Excis Meeting",
      description: "Video conferencing and online meeting platform for team collaboration",
      url: "https://jitsi.excis.com/",
      icon: Video,
      color: "#1e3a8a", // Excis Navy
      category: "communication"
    },
    {
      id: "excis-logger",
      name: "Excis Logger",
      description: "Productivity tracking and GDPR compliance monitoring system",
      url: "#",
      icon: ClipboardList,
      color: "#f97316", // Excis Orange
      category: "productivity"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PortalHeader onSearch={setSearchQuery} />
      <AppGrid apps={applications} searchQuery={searchQuery} />
      
      <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Company Portal. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Need help? Contact IT Support or visit the Help Center
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

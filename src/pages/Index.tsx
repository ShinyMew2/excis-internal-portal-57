import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Mail, Users, FileText, Shield, Calendar, Database, Headphones, Phone, Clock, ScrollText, Cloud, Video, ClipboardList, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import PortalHeader from "@/components/PortalHeader";
import AppGrid from "@/components/AppGrid";
import { AppData } from "@/components/AppCard";
import Announcements from "@/components/announcements/Announcements";
import WorldNewsWidget from "@/components/WorldNewsWidget";
import Ticker from "@/components/Ticker";

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
      url: "https://people.zoho.com",
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
      url: "https://sd.excis.com",
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
      url: "https://app.excis.me",
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
    },
    {
      id: "excis-erp",
      name: "Excis ERP",
      description: "Enterprise resource planning system for business operations management",
      url: "#",
      icon: Database,
      color: "#1e3a8a", // Excis Navy
      category: "business"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Ticker text="One World One Team" />
      <PortalHeader onSearch={setSearchQuery} />
      <Announcements />
      <AppGrid apps={applications} searchQuery={searchQuery} />
      <WorldNewsWidget />
      
      <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex-1 text-center">
              <p className="text-muted-foreground text-sm">
                © 2024 Excis Compliance. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Need help? Contact IT Support at <span className="font-medium">+44 13 44 93 09 00</span> or visit the Help Center
              </p>
            </div>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

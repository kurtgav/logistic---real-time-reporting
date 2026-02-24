import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Wrench, 
  Fuel, 
  Users, 
  Package, 
  Warehouse, 
  Map, 
  BarChart2, 
  Headphones, 
  Settings, 
  Bell, 
  Search,
  Plus,
  Calendar,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  Moon,
  ChevronRight,
  ChevronDown,
  User,
  X,
  CreditCard,
  Activity,
  FileText,
  Menu,
  Flag,
  Trash2,
  Edit,
  Save,
  Box,
  MoreHorizontal,
  Download,
  Disc,
  Lock,
  Info
} from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  LayoutDashboard,
  Truck,
  Wrench,
  Fuel,
  Users,
  Package,
  Warehouse,
  Map,
  BarChart2,
  Headphones,
  Settings,
  Bell,
  Search,
  Plus,
  Calendar,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  Moon,
  ChevronRight,
  ChevronDown,
  User,
  X,
  CreditCard,
  Activity,
  FileText,
  Menu,
  Flag,
  Trash2,
  Edit,
  Save,
  Box,
  MoreHorizontal,
  Download,
  Disc,
  Lock,
  Info
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className, strokeWidth }) => {
  const IconComponent = IconMap[name] || IconMap['Box']; // Fallback
  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
};
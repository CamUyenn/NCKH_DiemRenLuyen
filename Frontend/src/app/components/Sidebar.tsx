import Link from "next/link";
import "./../styles/Sidebar.css";

interface SidebarItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarFormLayoutProps {
  sidebarItems?: SidebarItem[];
}

const SidebarFormLayout: React.FC<SidebarFormLayoutProps> = ({
  sidebarItems = [],
}) => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {sidebarItems.map((item, index) => (
          <li key={index}>
            <Link href={item.path} className="sidebar-item">
              <span className="icon">{item.icon}</span>
              <span className="text">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SidebarFormLayout;
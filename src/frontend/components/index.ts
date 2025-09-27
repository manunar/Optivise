// Frontend components index
// Export all UI components
export * from "./ui/alert";
export * from "./ui/avatar";
export * from "./ui/badge";
export * from "./ui/button";
export * from "./ui/card";
export * from "./ui/checkbox";
export * from "./ui/icons";
export * from "./ui/input";
export * from "./ui/label";
export * from "./ui/navigation-menu";
export * from "./ui/progress";
export * from "./ui/select";
export * from "./ui/sheet";
export * from "./ui/table";
export * from "./ui/tabs";

// Export layout components
export { default as Navbar } from "./layout/Navbar";
export { default as Footer } from "./layout/Footer";

// Export auth components
export { default as ClientChoiceModal } from "./auth/ClientChoiceModal";

// Export page components
export { default as HomePage } from "./pages/HomePage";
export { default as ConfigurateurPage } from "./pages/ConfigurateurPage";
export { default as RecommandationsPage } from "./pages/RecommandationsPage";
export { default as DemandeDevisPage } from "./pages/DemandeDevisPage";
export { default as ConfirmationPage } from "./pages/ConfirmationPage";
export { default as AuditRefonteForm } from "./pages/AuditRefonteForm";
export { default as AuditRefonteFormWithAuth } from "./pages/AuditRefonteFormWithAuth";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    X, Menu, ChevronDown, MapPin, Building2,
    Home as HomeIcon, Waves, Mountain, Palmtree,
    Construction, Landmark, Gem, Trees, Globe,
    Handshake, ShieldCheck, Palette, Car, Layout, UserCheck, Sun, FileCheck,
    Users, Mail
} from "lucide-react";

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    console.log("Navbar is rendering");
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'buy', 'properties', 'services'

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            // High threshold (90% viewport) on Home, standard threshold on other pages
            const threshold = isHomePage ? window.innerHeight * 0.9 : 50;
            setIsScrolled(window.scrollY > threshold);
        };
        handleScroll(); // Sync state on mount
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHomePage]);

    const closeMegaMenu = () => setActiveMegaMenu(null);

    const [locations, setLocations] = useState([
        { name: "Kyrenia", icon: <Waves size={15} className="text-caria-turquoise/60" />, slug: "kyrenia" },
        { name: "Esentepe", icon: <Mountain size={15} className="text-caria-turquoise/60" />, slug: "esentepe" },
        { name: "İskele", icon: <Palmtree size={15} className="text-caria-turquoise/60" />, slug: "iskele" },
        { name: "Famagusta", icon: <Landmark size={15} className="text-caria-turquoise/60" />, slug: "famagusta" },
    ]);

    const [countries, setCountries] = useState([
        { name: "NORTHERN CYPRUS", slug: "northern-cyprus" },
        { name: "TURKEY", slug: "turkey" },
        { name: "ITALY", slug: "italy" },
        { name: "SPAIN", slug: "spain" },
        { name: "ENGLAND", slug: "england" },
        { name: "AMERICA", slug: "america" },
    ]);

    const [siteContent, setSiteContent] = useState([]);
    const [dynamicMenus, setDynamicMenus] = useState([]);

    useEffect(() => {
        const fetchNavbarData = async () => {
            try {
                const apiBase = "/api";
                // Fetch dynamic menus
                const menuRes = await fetch(`${apiBase}/cms/menus`);
                const menuData = await menuRes.json();
                if (menuData && Array.isArray(menuData)) {
                    setDynamicMenus(menuData);
                }

                const response = await fetch(`${apiBase}/cms/country-guides`);
                const data = await response.json();
                if (data && Array.isArray(data)) {
                    // setCountries(data.map(g => ({ name: g.country_name_tr, slug: g.slug })));
                }

                // Fetch site content for contact info
                const contentRes = await fetch(`${apiBase}/cms/content`);
                const contentData = await contentRes.json();
                if (contentData) setSiteContent(contentData);
            } catch (e) {
                console.error("Error fetching Navbar data:", e);
            }
        };
        fetchNavbarData();
    }, []);

    const getSetting = (key, defaultValue) => {
        const setting = siteContent?.find(c => c.content_key === key);
        return setting ? setting.value_tr : defaultValue;
    };

    const phone = getSetting('footer_phone', '+90 548 123 4567');
    const email = getSetting('footer_email', 'info@cariaestates.com');

    const categories = [
        { name: "Luxury Villas", icon: <Gem size={18} className="text-gray-400" /> },
        { name: "Sea View Apartments", icon: <Building2 size={18} className="text-gray-400" /> },
        { name: "New Developments", icon: <Construction size={18} className="text-gray-400" /> },
        { name: "Investment Land", icon: <Trees size={18} className="text-gray-400" /> },
        { name: "Beach Front Villas", icon: <Waves size={18} className="text-gray-400" /> },
        { name: "City Living Apartments", icon: <Building2 size={18} className="text-gray-400" /> },
    ];

    const services = [
        { name: "After Sale Services", link: "/after-sale-services", icon: <ShieldCheck size={18} /> },
        { name: "Consulting Services", link: "/consulting-services", icon: <Handshake size={18} /> },
        { name: "Property Management", link: "/property-management", icon: <Building2 size={18} /> },
        { name: "Transfer Services", link: "/transfer-services", icon: <Car size={18} /> },
        { name: "Vacation Planner", link: "/vacation-planner", icon: <Sun size={18} /> },
        { name: "Home Insurance", link: "/home-insurance", icon: <FileCheck size={18} /> },
    ];

    const howToBuyItems = [
        { name: "In Turkey", desc: "Türkiye'de Satın Alma", slug: "turkey" },
        { name: "In North Cyprus", desc: "Kuzey Kıbrıs'ta Satın Alma", slug: "cyprus" },
        { name: "In Italy", desc: "İtalya'da Satın Alma", slug: "italy" },
        { name: "In Spain", desc: "İspanya'da Satın Alma", slug: "spain" },
        { name: "In England", desc: "İngiltere'de Satın Alma", slug: "england" },
        { name: "In USA", desc: "Amerika'da Satın Alma", slug: "usa" },
    ];

    const [mobileSubmenu, setMobileSubmenu] = useState(null);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${isScrolled || activeMegaMenu
                    ? "bg-white/95 backdrop-blur-md shadow-sm text-caria-slate"
                    : "bg-transparent text-white"
                    }`}
                onMouseLeave={closeMegaMenu}
            >
                <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-6">
                    <div className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">

                        {/* Left Navigation */}
                        <nav className="hidden lg:flex items-center space-x-10 justify-start">
                            {[
                                { label: "PROPERTIES", path: "/properties", mega: "properties" },
                                { label: "COUNTRIES", path: "/properties", mega: "countries" },
                                { label: "SERVICES", path: "/services", mega: "services" }
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="relative py-2"
                                    onMouseEnter={() => item.mega ? setActiveMegaMenu(item.mega) : closeMegaMenu()}
                                >
                                    <Link
                                        to={item.path}
                                        className={`text-[11px] tracking-[0.2em] font-semibold transition-all duration-300 hover:text-caria-turquoise flex items-center gap-1.5 ${isScrolled || activeMegaMenu ? "text-caria-slate" : "text-white"
                                            }`}
                                    >
                                        {item.label}
                                        {item.mega && <ChevronDown size={14} className={`transition-transform duration-300 ${activeMegaMenu === item.mega ? 'rotate-180' : ''}`} />}
                                    </Link>
                                </div>
                            ))}
                        </nav>

                        {/* Center Logo - Only visible on scroll on Home, always visible elsewhere */}
                        <div className={`flex items-center justify-center transition-all duration-700 ${!isHomePage || isScrolled || activeMegaMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                            }`}>
                            <Link to="/" className="flex items-center" onClick={closeMegaMenu}>
                                <img
                                    src="/logo.png"
                                    alt="Caria Estates"
                                    className={`h-14 w-auto transition-all duration-700 ${isScrolled || activeMegaMenu ? '' : 'brightness-0 invert'}`}
                                />
                            </Link>
                        </div>

                        <nav className="hidden lg:flex items-center space-x-10 justify-end">
                            {[
                                { label: "VIEWING TRIP", path: "/viewing-trip/viewing-trips", mega: "viewing-trip" },
                                { label: "COMPANY", path: "/about", mega: "about" },
                                { label: "CONTACT", path: "/contact", mega: "contact" }
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="relative group py-2"
                                    onMouseEnter={() => item.mega ? setActiveMegaMenu(item.mega) : closeMegaMenu()}
                                >
                                    <Link
                                        to={item.path || "#"}
                                        className={`text-[11px] tracking-[0.2em] font-semibold transition-all duration-300 hover:text-caria-turquoise flex items-center gap-1.5 ${isScrolled || activeMegaMenu ? "text-caria-slate" : "text-white"
                                            }`}
                                    >
                                        {item.label}
                                        {item.mega && <ChevronDown size={14} className={`transition-transform duration-300 ${activeMegaMenu === item.mega ? 'rotate-180' : ''}`} />}
                                    </Link>
                                </div>
                            ))}
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`lg:hidden z-[110] ${isScrolled || activeMegaMenu ? 'text-caria-slate' : 'text-white'}`}
                        >
                            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Mega Menu / Dropdown Panels */}
                <div
                    className={`absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${activeMegaMenu ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                        }`}
                    style={{ maxHeight: activeMegaMenu ? '600px' : '0px' }}
                >
                    {/* PROPERTIES MEGA MENU — FULL WIDTH & SPACIOUS */}
                    {activeMegaMenu === 'properties' && (
                        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-14 pb-20">
                            <div className="grid grid-cols-3 gap-x-24 max-w-[1100px]">
                                {/* COLUMN 1 — FOR SALE */}
                                <div>
                                    <h4 className="text-[11px] tracking-[0.2em] uppercase text-black/85 font-bold mb-6">
                                        FOR SALE
                                    </h4>
                                    <div className="flex flex-col gap-3.5">
                                        {[
                                            { name: "Properties for Sale in Cyprus", query: "Cyprus" },
                                            { name: "Properties for Sale in Turkey", query: "Turkey" },
                                            { name: "Properties for Sale in Spain", query: "Spain" },
                                            { name: "Properties for Sale in Italy", query: "Italy" },
                                            { name: "Properties for Sale in England", query: "England" },
                                            { name: "Properties for Sale in USA", query: "USA" }
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                to={`/properties?search=${item.query}`}
                                                className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                                onClick={closeMegaMenu}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* COLUMN 2 — FOR RENT */}
                                <div>
                                    <h4 className="text-[11px] tracking-[0.2em] uppercase text-black/85 font-bold mb-6">
                                        FOR RENT
                                    </h4>
                                    <div className="flex flex-col gap-3.5">
                                        {[
                                            { name: "Properties for Rent in Cyprus", query: "Cyprus" },
                                            { name: "Properties for Rent in Turkey", query: "Turkey" },
                                            { name: "Properties for Rent in Spain", query: "Spain" },
                                            { name: "Properties for Rent in Italy", query: "Italy" },
                                            { name: "Properties for Rent in England", query: "England" },
                                            { name: "Properties for Rent in USA", query: "USA" }
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                to={`/properties?search=${item.query}`}
                                                className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                                onClick={closeMegaMenu}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* COLUMN 3 — CATEGORIES */}
                                <div>
                                    <h4 className="text-[11px] tracking-[0.2em] uppercase text-black/85 font-bold mb-6">
                                        CATEGORIES
                                    </h4>
                                    <div className="flex flex-col gap-3.5">
                                        {[
                                            "Luxury Villas",
                                            "Seaview Properties",
                                            "New Developments",
                                            "Lands for Investment",
                                            "Beachfront Properties",
                                            "City Scape Properties"
                                        ].map((item) => (
                                            <Link
                                                key={item}
                                                to={`/properties?category=${item}`}
                                                className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                                onClick={closeMegaMenu}
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COUNTRIES MEGA MENU — HORIZONTAL 6-COLUMN LISTS */}
                    {activeMegaMenu === 'countries' && (
                        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-14 pb-20">
                            <div className="grid grid-cols-6 gap-x-10 max-w-[1300px]">
                                {[
                                    { name: "CYPRUS", slug: "northern-cyprus", p_slug: "cyprus" },
                                    { name: "TURKEY", slug: "turkey", p_slug: "turkey" },
                                    { name: "SPAIN", slug: "spain", p_slug: "spain" },
                                    { name: "ITALY", slug: "italy", p_slug: "italy" },
                                    { name: "ENGLAND", slug: "england", p_slug: "england" },
                                    { name: "USA", slug: "usa", p_slug: "usa" }
                                ].map((country) => (
                                    <div key={country.name} className="flex flex-col">
                                        <Link
                                            to={`/properties?country=${country.slug}`}
                                            className="text-[11px] font-bold tracking-[0.2em] text-black/85 hover:text-caria-turquoise transition-colors duration-300 mb-6 inline-block w-fit"
                                            onClick={closeMegaMenu}
                                        >
                                            {country.name}
                                        </Link>
                                        <div className="flex flex-col gap-3.5">
                                            {[
                                                { label: `Why ${country.name.charAt(0) + country.name.slice(1).toLowerCase()}`, path: `/consulting-services?country=${country.p_slug}` },
                                                { label: "How to Buy", path: `/consulting-services?country=${country.p_slug}` },
                                                { label: "Expenses When Buying", path: `/consulting-services?country=${country.p_slug}` }
                                            ].map((link) => (
                                                <Link
                                                    key={link.label}
                                                    to={link.path}
                                                    className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                                    onClick={closeMegaMenu}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SERVICES DROPDOWN — UNIFIED LIST */}
                    {activeMegaMenu === 'services' && (
                        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-14 pb-20">
                            <div className="grid grid-cols-4 gap-x-10 max-w-[1100px]">
                                {/* COLUMN 1 — REAL ESTATE */}
                                <div>
                                    <h4 className="text-[11px] tracking-[0.2em] uppercase text-black/85 font-bold mb-6">
                                        REAL ESTATE
                                    </h4>
                                    <div className="flex flex-col gap-3.5">
                                        {[
                                            { name: "Property Management", link: "/property-management" },
                                            { name: "Legal Consulting", link: "/legal-consulting" },
                                            { name: "Investment Advisory", link: "/investment-advisory" },
                                            { name: "Resale Services", link: "/resale-services" }
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.link}
                                                className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                                onClick={closeMegaMenu}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* COLUMN 2 — LIFESTYLE */}
                                <div>
                                    <h4 className="text-[11px] tracking-[0.2em] uppercase text-black/85 font-bold mb-6">
                                        LIFESTYLE
                                    </h4>
                                    <div className="flex flex-col gap-3.5">
                                        {[
                                            { name: "Transfer Services", link: "/transfer-services" },
                                            { name: "Vacation Planner", link: "/vacation-planner" },
                                            { name: "Personal Concierge", link: "/contact" },
                                            { name: "Health Insurance", link: "/home-insurance" }
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.link}
                                                className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                                onClick={closeMegaMenu}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* COLUMN 3 — CORPORATE */}
                                <div>
                                    <h4 className="text-[11px] tracking-[0.2em] uppercase text-black/85 font-bold mb-6">
                                        CORPORATE
                                    </h4>
                                    <div className="flex flex-col gap-3.5">
                                        {[
                                            { name: "Market Reports", link: "/about" },
                                            { name: "Partnership Program", link: "/contact" },
                                            { name: "Interior Design", link: "/services" },
                                            { name: "Project Development", link: "/services" }
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.link}
                                                className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                                onClick={closeMegaMenu}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* VIEWING TRIP DROPDOWN — UNIFIED VERTICAL LIST */}
                    {activeMegaMenu === 'viewing-trip' && (
                        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-14 pb-20">
                            <div className="max-w-[800px] flex flex-col">
                                <h4 className="text-[11px] tracking-[0.2em] uppercase text-black/85 font-bold mb-6">
                                    VIEWING TRIP
                                </h4>
                                <div className="flex flex-col gap-3.5">
                                    {[
                                        { name: "Property Viewing Trips", link: "/viewing-trip/viewing-trips" },
                                        { name: "Viewing Trip Turkey", link: "/contact" },
                                        { name: "Viewing Trip Spain", link: "/contact" },
                                        { name: "Viewing Trip Italy", link: "/contact" },
                                        { name: "Viewing Trip England", link: "/contact" },
                                        { name: "Viewing Trip USA", link: "/contact" }
                                    ].map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.link}
                                            className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                            onClick={closeMegaMenu}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* COMPANY DROPDOWN — UNIFIED */}
                    {activeMegaMenu === 'about' && (
                        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-14 pb-20">
                            <div className="max-w-[800px] flex flex-col">
                                <h4 className="text-[11px] tracking-[0.2em] uppercase text-black/85 font-bold mb-6">
                                    COMPANY
                                </h4>
                                <div className="flex flex-col gap-3.5">
                                    {[
                                        { name: "About Us", link: "/about" },
                                        { name: "Our Team", link: "/about" },
                                        { name: "Join Us", link: "/contact" },
                                        { name: "Careers", link: "/about" },
                                        { name: "Contact", link: "/contact" }
                                    ].map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.link}
                                            className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                            onClick={closeMegaMenu}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTACT DROPDOWN — UNIFIED 4-COLUMN OFFICES */}
                    {activeMegaMenu === 'contact' && (
                        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-14 pb-20">
                            <div className="grid grid-cols-4 gap-x-10 max-w-[1100px]">
                                {[
                                    { name: "CYPRUS OFFICE", sub: "Kyrenia / Girne" },
                                    { name: "TURKEY OFFICE", sub: "Alanya / Antalya" },
                                    { name: "ITALY OFFICE", sub: "Rome / Tuscany" },
                                    { name: "USA OFFICE", sub: "Miami / Orlando" }
                                ].map((office) => (
                                    <div key={office.name} className="flex flex-col">
                                        <h4 className="text-[11px] font-bold tracking-[0.2em] text-black/85 mb-6">
                                            {office.name}
                                        </h4>
                                        <div className="flex flex-col gap-3.5">
                                            {[
                                                { label: "Call Us", path: "tel:+90" },
                                                { label: "WhatsApp", path: "https://wa.me/" },
                                                { label: office.sub, path: "/contact" }
                                            ].map((link) => (
                                                <Link
                                                    key={link.label}
                                                    to={link.path}
                                                    className="text-[10px] text-caria-slate/90 hover:text-caria-turquoise transition-all duration-300 font-medium tracking-wide inline-block w-fit border-b border-transparent hover:border-caria-turquoise/40 pb-0.5 hover:translate-x-1"
                                                    onClick={closeMegaMenu}
                                                >
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-white z-[105] transition-all duration-500 ease-in-out lg:hidden ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
                    }`}
            >
                <div className="flex flex-col h-full pt-32 px-10 pb-12 overflow-y-auto">
                    <div className="space-y-8">
                        {/* Main Links */}
                        <div className="flex flex-col space-y-6">
                            {[
                                { label: "PROPERTIES", path: "/properties" },
                                { label: "COUNTRIES", path: "/properties" },
                                { label: "SERVICES", path: "/services" },
                                { label: "VIEWING TRIP", path: "/viewing-trip/viewing-trips" },
                                { label: "COMPANY", path: "/about" },
                                { label: "CONTACT", path: "/contact" }
                            ].map((item) => (
                                <div key={item.label} className="flex flex-col">
                                    <div className="flex items-center justify-between group">
                                        <Link
                                            to={item.path}
                                            className="text-2xl font-serif text-caria-slate tracking-wide"
                                            onClick={() => !item.submenu && setIsMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                        {item.submenu && (
                                            <button
                                                onClick={() => setMobileSubmenu(mobileSubmenu === item.label ? null : item.label)}
                                                className="p-2"
                                            >
                                                <ChevronDown
                                                    size={20}
                                                    className={`transition-transform duration-300 ${mobileSubmenu === item.label ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {item.submenu && mobileSubmenu === item.label && (
                                        <div className="mt-4 ml-4 flex flex-col space-y-4 border-l-2 border-caria-mint/20 pl-6 py-2 overflow-hidden transition-all animate-in slide-in-from-top-2">
                                            {item.submenu.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.path || sub.link || (item.label === "HOW TO BUY" ? `/consulting-services?country=${sub.slug}` : `/${sub.slug}`)}
                                                    className="text-sm font-light tracking-[0.1em] text-caria-slate/70 flex flex-col"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <span className="text-caria-slate font-medium text-xs mb-0.5">{sub.name}</span>
                                                    <span className="text-[10px] opacity-60 italic">{sub.desc}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="w-12 h-px bg-gray-100" />

                        {/* Secondary info */}
                        <div className="space-y-4">
                            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold">Contact</p>
                            <p className="text-sm text-caria-slate font-light">{phone}</p>
                            <p className="text-sm text-caria-slate font-light">{email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Blur Overlay for Mega Menu */}
            <div
                className={`fixed inset-0 bg-black/5 z-[90] transition-opacity duration-500 backdrop-blur-[2px] ${activeMegaMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeMegaMenu}
            />
        </>
    );
};

export default Navbar;

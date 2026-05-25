import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BarChart3,
  Hospital,
  CreditCard,
  Search,
  Bell,
  Moon,
  Sun,
  MoreVertical,
  Plus,
  Paperclip,
  Send,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Gavel,
  Clock,
  Shield,
  Activity,
  LifeBuoy,
  MessageCircle,
  Ticket,
  Menu,
  Eye,
  X as CloseIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

import {
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { handleFirestoreError, OperationType } from "../lib/firestoreUtils";

// --- Types ---

interface Inquiry {
  id: string;
  patientName: string;
  country: string;
  flag: string;
  treatment: string;
  date: string;
  status: "new" | "quoted" | "scheduled";
}

// --- Mock Data ---

const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "1",
    patientName: "James Wilson",
    country: "United Kingdom",
    flag: "🇬🇧",
    treatment: "Dental Rehabilitation",
    date: "2h ago",
    status: "new",
  },
  {
    id: "2",
    patientName: "Elena Rodriguez",
    country: "Spain",
    flag: "🇪🇸",
    treatment: "Hip Replacement",
    date: "5h ago",
    status: "new",
  },
  {
    id: "3",
    patientName: "Ahmed Hassan",
    country: "UAE",
    flag: "🇦🇪",
    treatment: "Cardiac Checkup",
    date: "1d ago",
    status: "quoted",
  },
  {
    id: "4",
    patientName: "Sarah Chen",
    country: "Singapore",
    flag: "🇸🇬",
    treatment: "IVF Treatment",
    date: "2d ago",
    status: "scheduled",
  },
  {
    id: "5",
    patientName: "Robert Müller",
    country: "Germany",
    flag: "🇩🇪",
    treatment: "Knee Surgery",
    date: "3h ago",
    status: "new",
  },
];

const TENDERS_MOCK = [
  {
    id: "T-101",
    service: "Knee Replacement Batch",
    region: "Southeast Asia",
    category: "Orthopaedics",
    budget: "$120k - $150k",
    deadline: "3 days left",
    description:
      "Institutional request for 10 units of surgical knee replacement including post-op physiotherapy.",
    requirements: [
      "Patient stabilized for 12h international transit",
      "Full medical dossier translated to Institutional English",
      "GMAA Liaison confirmed for arrival logistics",
    ],
  },
  {
    id: "T-102",
    service: "Cardiac Imaging Sweep",
    region: "Middle East",
    category: "Cardiology",
    budget: "$80k",
    deadline: "5 days left",
    description: "Comprehensive cardiac imaging audit for 50 executive patients.",
    requirements: [
      "ISO 27001 compliant imaging storage",
      "Certified Cardiologist sign-off on all 2D echos",
      "Audit timeline commitment: 14 business days",
    ],
  },
];

const CHAT_MOCK = [
  {
    sender: "vendor",
    text: "Does the patient have recent MRIs?",
    time: "2:15 PM",
  },
  {
    sender: "admin",
    text: "Yes, we are auditing the digital dossiers now.",
    time: "2:30 PM",
  },
];

const DEMAND_DATA = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 520 },
  { name: "Mar", value: 480 },
  { name: "Apr", value: 610 },
  { name: "May", value: 750 },
  { name: "Jun", value: 890 },
];

const SPARKLINE_DATA = [
  { v: 10 },
  { v: 25 },
  { v: 15 },
  { v: 30 },
  { v: 20 },
  { v: 45 },
  { v: 35 },
];

// --- Components ---

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  data,
}: {
  title: string;
  value: string;
  change: string;
  icon: any;
  data: any[];
}) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4 hover:shadow-xl transition-all"
  >
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan">
        <Icon size={20} />
      </div>
      <div className="text-right">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </p>
        <h3 className="text-2xl font-black text-navy dark:text-white mt-1">
          {value}
        </h3>
      </div>
    </div>
    <div className="flex items-end justify-between gap-4 mt-2">
      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
        <TrendingUp size={10} /> {change}
      </div>
      <div className="h-10 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#2C74B3"
              fill="#2C74B3"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

const KanbanCard = ({ inquiry }: { inquiry: Inquiry; key?: string }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
    className="bg-navy dark:bg-slate-800 p-6 rounded-3xl border border-white/10 shadow-lg cursor-pointer transition-all group overflow-hidden relative"
  >
    <div className="absolute top-0 right-0 p-4">
      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
        {inquiry.date}
      </span>
    </div>

    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shadow-inner">
        {inquiry.flag}
      </div>
      <div>
        <h4 className="font-black text-white text-base tracking-tight leading-none italic">
          {inquiry.patientName}
        </h4>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={10} className="text-cyan" />
          <span className="text-[10px] text-cyan/60 font-black uppercase tracking-widest">
            {inquiry.country}
          </span>
        </div>
      </div>
    </div>

    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
          {inquiry.treatment}
        </span>
      </div>
      <ChevronRight
        size={14}
        className="text-white/20 group-hover:text-cyan transition-colors"
      />
    </div>
  </motion.div>
);

export default function ProviderDashboard({
  onLogout,
  onViewProfile,
  onHome,
}: {
  onLogout?: () => void;
  onViewProfile?: (id: string) => void;
  onHome?: () => void;
}) {
  const { user, profile } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedSupportTicketId, setSelectedSupportTicketId] = useState<string | null>(null);
  const [inquiryMessages, setInquiryMessages] = useState<any[]>([]);
  const [inquiryDocuments, setInquiryDocuments] = useState<any[]>([]);
  const [inquiryChatMsg, setInquiryChatMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTender, setSelectedTender] = useState<any>(null);
  const [bestBidPrice, setBestBidPrice] = useState<number | null>(null);
  const [existingBidId, setExistingBidId] = useState<string | null>(null);
  const [isBidding, setIsBidding] = useState(false);
  const [bidPrice, setBidPrice] = useState("");
  const [surgeonName, setSurgeonName] = useState("");
  const [inclusions, setInclusions] = useState("");
  const [isShieldOpen, setIsShieldOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Priority Actions Mock
  const PRIORITY_ACTIONS = [
    {
      id: "a1",
      type: "message",
      title: "GMAA Backend Update",
      detail: "Case #432 Priority Coordination",
      priority: "high",
      icon: MessageSquare,
      targetTab: "support",
    },
    {
      id: "a2",
      type: "tender",
      title: "Tender Expiring",
      detail: "Cardiac Imaging Sweep (Middle East)",
      priority: "medium",
      icon: Clock,
      targetTab: "tenders",
    },
    {
      id: "a3",
      type: "profile",
      title: "Profile Audit",
      detail: "Update Ward Pricing Index (2 days overdue)",
      priority: "low",
      icon: Shield,
      targetTab: "profile",
    },
  ];

  // Firestore Hooks
  const [tendersValue, tendersLoading, tendersError] = useCollection(
    user ? collection(db, "tenders") : null,
  );
  const [bidsValue, bidsLoading, bidsError] = useCollection(
    user
      ? query(collection(db, "bids"), where("vendorId", "==", user.uid))
      : null,
  );

  const [supportTicketsValue] = useCollection(
    user
      ? query(
          collection(db, "support_tickets"),
          where("vendorId", "==", user.uid),
          orderBy("lastUpdated", "desc"),
        )
      : null,
  );

  const supportTickets =
    supportTicketsValue?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) ||
    [];

  // Support Messages Hook - for the dashboard preview
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    if (!selectedSupportTicketId) {
      setSelectedSupportTicketId(`general_${user.uid}`);
    }

    const ticketId = selectedSupportTicketId || `general_${user.uid}`;
    const q = query(
      collection(db, `support_tickets/${ticketId}/messages`),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        setSupportMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (error) =>
        handleFirestoreError(
          error,
          OperationType.GET,
          `support_tickets/${ticketId}/messages`,
        ),
    );
  }, [user, selectedSupportTicketId]);

  useEffect(() => {
    if (tendersError)
      handleFirestoreError(tendersError, OperationType.LIST, "tenders");
    if (bidsError) handleFirestoreError(bidsError, OperationType.LIST, "bids");
  }, [tendersError, bidsError]);

  const tenders = tendersValue
    ? tendersValue.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    : TENDERS_MOCK;
  const myBids = bidsValue
    ? bidsValue.docs.map((doc) => ({
        tenderId: doc.data().tenderId,
        id: doc.id,
        price: doc.data().price,
      }))
    : [];
  const myBidTenderIds = myBids.map((b) => b.tenderId);

  // Best Bid & Existing Bid Tracker
  useEffect(() => {
    if (!selectedTender) {
      setBestBidPrice(null);
      setExistingBidId(null);
      return;
    }

    // Find if I already bid
    const myExistingBid = myBids.find((b) => b.tenderId === selectedTender.id);
    if (myExistingBid) {
      setExistingBidId(myExistingBid.id);
      setBidPrice(myExistingBid.price.toString());
    } else {
      setExistingBidId(null);
      setBidPrice("");
    }

    // Listen for best bid on this tender
    const bidsRef = collection(db, "bids");
    const q = query(
      bidsRef,
      where("tenderId", "==", selectedTender.id),
      orderBy("price", "asc"),
      limit(1),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          setBestBidPrice(snapshot.docs[0].data().price);
        } else {
          setBestBidPrice(null);
        }
      },
      (err) => {
        console.warn("Market bid query failed (likely missing index):", err);
        // Fallback: the query might fail without a composite index
      },
    );

    return () => unsubscribe();
  }, [selectedTender, bidsValue]);

  // Inquiry Dossier Sync
  useEffect(() => {
    if (!selectedInquiry || !user) return;

    const messagesPath = `leads/${selectedInquiry.id}/messages`;
    const docsPath = `leads/${selectedInquiry.id}/documents`;

    const qMessages = query(
      collection(db, messagesPath),
      orderBy("createdAt", "asc"),
    );
    const qDocs = query(collection(db, docsPath), orderBy("createdAt", "desc"));

    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setInquiryMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    }, (error) => handleFirestoreError(error, OperationType.GET, messagesPath));

    const unsubDocs = onSnapshot(qDocs, (snapshot) => {
      setInquiryDocuments(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    }, (error) => handleFirestoreError(error, OperationType.GET, docsPath));

    return () => {
      unsubMessages();
      unsubDocs();
    };
  }, [selectedInquiry, user]);

  const handleSendInquiryMessage = async () => {
    if (!inquiryChatMsg || !selectedInquiry || !user) return;
    const path = `leads/${selectedInquiry.id}/messages`;
    try {
      await addDoc(collection(db, path), {
        text: inquiryChatMsg,
        sender: "vendor",
        senderName: profile?.displayName || "Hospital Admin",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
      });
      setInquiryChatMsg("");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleUploadDossierDoc = async () => {
    if (!selectedInquiry || !user) return;
    setIsUploading(true);
    // Mock simulation of file upload
    setTimeout(async () => {
      const path = `leads/${selectedInquiry.id}/documents`;
      try {
        await addDoc(collection(db, path), {
          name: "PATIENT_HISTORY_REV.pdf",
          url: "#",
          type: "application/pdf",
          size: "2.4 MB",
          uploadedBy: profile?.displayName || "Vendor",
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      } finally {
        setIsUploading(false);
      }
    }, 1500);
  };

  // Chat Sync
  useEffect(() => {
    if (!isShieldOpen || !user) return;

    // For now, using a generic "global" chat for the demo or specific to the first tender
    const tenderId = selectedTender?.id || "T-101";
    const chatPath = `tenders/${tenderId}/chats/${user.uid}/messages`;

    const q = query(collection(db, chatPath), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, chatPath);
      },
    );

    return () => unsubscribe();
  }, [isShieldOpen, user, selectedTender]);

  const handleTransmitBid = async () => {
    if (!user || !selectedTender) return;
    if (!bidPrice || isNaN(Number(bidPrice))) {
      alert("Please enter a valid numeric price.");
      return;
    }
    setIsBidding(true);

    try {
      const bidData: any = {
        tenderId: selectedTender.id,
        vendorId: user.uid,
        vendorName:
          profile?.displayName ||
          user.email?.split("@")[0] ||
          "Unknown Hospital",
        hospitalName:
          profile?.displayName || profile?.hospitalName || "St. Luke's Medical",
        price: Number(bidPrice),
        margin: 15, // Default margin
        surgeon: surgeonName,
        inclusions: inclusions
          ? inclusions
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        updatedAt: serverTimestamp(),
      };

      if (!existingBidId) {
        bidData.createdAt = serverTimestamp();
        await addDoc(collection(db, "bids"), bidData);
        console.log("[Bidding] Bid created successfully");
      } else {
        await updateDoc(doc(db, "bids", existingBidId), bidData);
        console.log("[Bidding] Bid updated successfully");
      }

      setSelectedTender(null);
      setBidPrice("");
      setSurgeonName("");
      setInclusions("");
    } catch (error: any) {
      console.error("[Bidding] Transaction error:", error);
      alert(`Failed to transmit bid: ${error.message || "Unknown error"}`);
      handleFirestoreError(error, OperationType.WRITE, "bids");
    } finally {
      setIsBidding(false);
    }
  };

  const chatEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supportMessages]);

  const handleSendMessage = async (isGeneralSupport = false) => {
    if (!chatMessage || !user) return;

    let chatPath = "";
    if (isGeneralSupport) {
      const ticketId = selectedSupportTicketId || `general_${user.uid}`;
      chatPath = `support_tickets/${ticketId}/messages`;

      try {
        const ticketRef = doc(db, "support_tickets", ticketId);
        const ticketSnap = await getDoc(ticketRef);

        if (!ticketSnap.exists()) {
          await setDoc(ticketRef, {
            vendorId: user.uid,
            vendorName: profile?.displayName || "St. Luke's Medical",
            subject: ticketId.startsWith("general_")
              ? "General Dashboard Support"
              : "Ticket Follow-up",
            status: "open",
            priority: "medium",
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            lastMessage: chatMessage,
          });
        } else {
          await updateDoc(ticketRef, {
            lastMessage: chatMessage,
            lastUpdated: serverTimestamp(),
            status: "open",
          });
        }
      } catch (e) {
        console.error("Error updating ticket meta:", e);
      }
    } else {
      const tenderId = selectedTender?.id || "T-101";
      chatPath = `tenders/${tenderId}/chats/${user.uid}/messages`;
    }

    try {
      await addDoc(collection(db, chatPath), {
        text: chatMessage,
        sender: "vendor",
        senderName: profile?.displayName || "Hospital Admin",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
      });
      setChatMessage("");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, chatPath);
    }
  };

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const handleCreateTicket = async () => {
    if (!ticketSubject || !ticketMessage || !user) return;
    setIsCreatingTicket(true);
    setTicketSuccess(false);
    try {
      const ticketRef = await addDoc(collection(db, "support_tickets"), {
        vendorId: user.uid,
        vendorName: profile?.displayName || "St. Luke's Medical",
        subject: ticketSubject,
        status: "open",
        priority: "medium",
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        lastMessage: ticketMessage,
      });

      await addDoc(collection(db, `support_tickets/${ticketRef.id}/messages`), {
        text: ticketMessage,
        sender: "vendor",
        senderName: profile?.displayName || "Hospital Admin",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
      });

      setSelectedSupportTicketId(ticketRef.id);
      setTicketSubject("");
      setTicketMessage("");
      setTicketSuccess(true);
      setTimeout(() => setTicketSuccess(false), 5000);
      // Removed setActiveTab("dashboard") to allow user to see the ticket in support view
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "support_tickets");
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const renderSupport = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Raise Concern Form */}
        <div className="bg-white p-12 rounded-[48px] border border-navy/5 shadow-sm space-y-8">
          <div>
            <h3 className="text-3xl font-bold text-navy uppercase tracking-tighter">
              Raise a Concern
            </h3>
            <p className="text-xs text-navy/40 font-bold uppercase tracking-widest mt-2">
              Direct line to GMAA Backend support
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 mb-2 block">
                Subject / Topic
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Dashboard access issue"
                className="w-full bg-slate-bg border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-red/10 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 mb-2 block">
                Detailed Concern
              </label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Tell us what is happening..."
                rows={5}
                className="w-full bg-slate-bg border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-red/10 transition-all resize-none"
              />
            </div>
            <button
              onClick={handleCreateTicket}
              disabled={isCreatingTicket || !ticketSubject || !ticketMessage}
              className="w-full bg-navy text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-xl shadow-navy/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isCreatingTicket ? "Transmitting..." : "Generate Ticket"}
            </button>
            {ticketSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center"
              >
                Ticket Successfully Transmitted
              </motion.div>
            )}
          </div>
        </div>

        {/* Existing Tickets */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-black text-navy uppercase tracking-[0.4em] mb-4">
            Recent Support Activity
          </h3>
          <div className="space-y-4">
            {supportTickets.map((ticket: any) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedSupportTicketId(ticket.id)}
                className={cn(
                  "bg-white p-6 rounded-[32px] border shadow-sm group hover:scale-[1.02] transition-all cursor-pointer",
                  selectedSupportTicketId === ticket.id
                    ? "border-cyan/40 bg-cyan/[0.02]"
                    : "border-navy/5",
                )}
              >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg",
                          ticket.status === "open"
                            ? "bg-amber-500/10 text-amber-600"
                            : ticket.status === "pending"
                              ? "bg-cyan/10 text-cyan animate-pulse"
                              : "bg-emerald-500/10 text-emerald-600",
                        )}
                      >
                        {ticket.status === "pending" ? "New Reply" : ticket.status}
                      </span>
                      <span className="text-[9px] font-bold text-navy/20 uppercase tracking-widest">
                        ID: {ticket.id.slice(0, 8)}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-navy/20 uppercase">
                      {ticket.createdAt?.toDate
                        ? ticket.createdAt.toDate().toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-navy mb-2 group-hover:text-cyan transition-colors">
                    {ticket.subject}
                  </h4>
                  <p className="text-[9px] font-medium text-navy/40 line-clamp-1 italic">
                    {ticket.lastMessage || "Awaiting transmission..."}
                  </p>
              </div>
            ))}
            {supportTickets.length === 0 && (
              <div className="bg-navy/[0.02] border border-dashed border-navy/10 rounded-[40px] p-12 text-center">
                <LifeBuoy size={32} className="mx-auto mb-4 text-navy/10" />
                <p className="text-[10px] font-black text-navy/20 uppercase tracking-widest">
                  No support history found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-4 md:p-10 pb-32 space-y-8 md:space-y-12">
      {/* Action Center - High Priority Section */}
      <section>
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/20">
            <AlertCircle className="text-white" size={20} />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-navy dark:text-white">
            Action Center
          </h2>
          <div className="h-[2px] flex-grow bg-navy/5 dark:bg-white/5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRIORITY_ACTIONS.map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveTab(action.targetTab)}
              className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-navy/5 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-navy/10 transition-all cursor-pointer overflow-hidden"
            >
              <div
                className={cn(
                  "absolute top-0 right-0 w-32 h-32 blur-3xl -translate-y-16 translate-x-16 opacity-30 transition-all group-hover:scale-150",
                  action.priority === "high"
                    ? "bg-brand-red"
                    : action.priority === "medium"
                      ? "bg-cyan"
                      : "bg-emerald-500",
                )}
              />

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                    action.priority === "high"
                      ? "bg-brand-red/10 text-brand-red"
                      : "bg-cyan/10 text-cyan",
                  )}
                >
                  <action.icon size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                      action.priority === "high"
                        ? "bg-brand-red text-white"
                        : "bg-slate-bg dark:bg-white/5 text-navy/40 dark:text-white/40",
                    )}
                  >
                    {action.priority}
                  </span>
                </div>
              </div>
              <h4 className="text-base font-black text-navy dark:text-white uppercase tracking-tight mb-2 relative z-10">
                {action.title}
              </h4>
              <p className="text-[11px] font-bold text-navy/30 dark:text-white/30 uppercase tracking-[0.15em] leading-relaxed relative z-10">
                {action.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Content: Active Cases & Tenders */}
        <div className="xl:col-span-8 space-y-12">
          {/* Market Tenders */}
          <div className="bg-white dark:bg-slate-900/60 rounded-[3.5rem] p-10 border border-navy/5 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan/10 rounded-2xl flex items-center justify-center text-cyan">
                  <Gavel size={24} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-navy dark:text-white tracking-tight">
                  Live Tenders
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("tenders")}
                className="text-[10px] font-black text-cyan uppercase tracking-widest hover:text-brand-red transition-all border-b border-cyan/20 hover:border-brand-red/20 pb-1"
              >
                Marketplace Access
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {tenders.slice(0, 2).map((tender: any) => (
                <motion.div
                  key={tender.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedTender(tender)}
                  className="bg-slate-bg dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] border border-navy/5 dark:border-slate-700 shadow-sm relative group overflow-hidden cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-6 md:mb-8 gap-4">
                    <h4 className="text-lg md:text-xl font-serif font-bold text-navy dark:text-white leading-tight min-w-0 flex-1">
                      {tender.service}
                    </h4>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-cyan bg-white dark:bg-navy px-2 py-1 md:px-3 md:py-1.5 rounded-xl shadow-sm italic whitespace-nowrap">
                        REF: {tender.id}
                      </span>
                      {myBidTenderIds.includes(tender.id) && (
                        <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                          <CheckCircle2 size={8} /> Active
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
                    <div className="px-3 py-1 bg-navy dark:bg-navy/50 text-white rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                      {tender.category}
                    </div>
                    <div className="flex items-center gap-1 text-brand-red text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                      <Clock size={10} />
                      {tender.deadline || "7 days left"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-navy/5 dark:border-white/5">
                    <div className="text-[9px] md:text-[10px] font-black text-navy/30 uppercase tracking-widest">
                      EST:{" "}
                      <span className="text-navy dark:text-white underline decoration-cyan/30 underline-offset-4">
                        {tender.budget}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTender(tender);
                      }}
                      className="px-4 md:px-6 py-2 md:py-3 bg-white dark:bg-cyan text-navy dark:text-white rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] hover:bg-brand-red hover:text-white shadow-xl transition-all active:scale-95"
                    >
                      {myBidTenderIds.includes(tender.id) ? "Rebid" : "Propose"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Case Board (Kanban) */}
          <div className="bg-white dark:bg-slate-900/60 rounded-[3.5rem] p-10 border border-navy/5 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center text-white shadow-lg shadow-navy/20 text-brand-red italic font-black">
                  SL
                </div>
                <h3 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tighter italic">
                  Active Cases
                </h3>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("inquiries")}
                  className="bg-slate-bg dark:bg-white/5 text-navy dark:text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-sm"
                >
                  Records
                </button>
                <button className="bg-brand-red text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-red/20 active:scale-95">
                  <Plus size={14} className="inline mr-2" /> Open Case
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {["New", "Quoted", "Scheduled"].map((status) => (
                <div key={status} className={cn(
                  "space-y-6",
                  status === "Scheduled" ? "md:col-span-2 lg:col-span-1" : ""
                )}>
                  <div className="flex items-center justify-between px-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          status === "New"
                            ? "bg-emerald-500"
                            : status === "Quoted"
                              ? "bg-cyan"
                              : "bg-navy",
                        )}
                      />
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-navy/40 dark:text-white/40">
                        {status}
                      </span>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black bg-navy/5 dark:bg-white/5 text-navy dark:text-white w-6 h-6 flex items-center justify-center rounded-xl leading-none shadow-inner border border-navy/5">
                      {
                        filteredInquiries.filter(
                          (i) =>
                            i.status.toLowerCase() === status.toLowerCase(),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    {filteredInquiries
                      .filter(
                        (i) => i.status.toLowerCase() === status.toLowerCase(),
                      )
                      .map((inquiry) => (
                        <div
                          onClick={() => setSelectedInquiry(inquiry)}
                          key={inquiry.id}
                        >
                          <KanbanCard inquiry={inquiry} />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-4 space-y-10">
          {/* Profile Visibility Analytics */}
          <div className="bg-navy rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-navy/40">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-cyan">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">
                  Intel Visibility
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-10 mb-12">
                <div>
                  <p className="text-5xl font-black italic tracking-tighter mb-2 text-white reveal-text">
                    12.5k
                  </p>
                  <p className="text-[9px] font-black text-cyan uppercase tracking-[0.2em] leading-none">
                    Market Reach
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-black italic tracking-tighter mb-2 text-brand-red">
                    4.9
                  </p>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] leading-none">
                    Authority
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    label: "Patient Inquiries",
                    val: "+34%",
                    color: "text-emerald-400",
                  },
                  {
                    label: "Tender Win Rate",
                    val: "18.6%",
                    color: "text-cyan",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {stat.label}
                    </span>
                    <span
                      className={cn("text-base font-black italic", stat.color)}
                    >
                      {stat.val}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-12 py-5 bg-white text-navy rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-cyan hover:text-white transition-all shadow-xl shadow-white/10 active:scale-95">
                Market Intel Hub
              </button>
            </div>
          </div>

          {/* Secure Bridge Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-sm border border-navy/5 dark:border-white/10 overflow-hidden flex flex-col h-[650px]">
            <div className="p-10 border-b border-navy/5 dark:border-white/10 flex items-center justify-between bg-slate-bg dark:bg-slate-800/30">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-3xl bg-navy flex items-center justify-center text-white ring-4 ring-cyan/20 shadow-lg font-black text-xs">
                    GMAA
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900" />
                </div>
                <div>
                  <h4 className="text-base font-black uppercase italic text-navy dark:text-white tracking-tight">
                    GMAA Backend
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield size={12} className="text-cyan" />
                    <p className="text-[9px] text-cyan font-black uppercase tracking-[0.1em]">
                      {selectedSupportTicketId?.startsWith("general_")
                        ? "Institutional Lane"
                        : "Ticket Support Lane"}
                    </p>
                  </div>
                </div>
              </div>
              <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl hover:shadow-xl transition-all text-navy/20 dark:text-white/20 hover:text-navy group">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="flex-1 p-10 overflow-y-auto space-y-8 flex flex-col custom-scrollbar">
              {(supportMessages.length > 0 ? supportMessages : CHAT_MOCK).map(
                (msg: any, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[90%] flex flex-col",
                      msg.sender === "vendor" ? "self-end" : "self-start",
                    )}
                  >
                    <div
                      className={cn(
                        "px-6 py-5 rounded-[2.5rem] text-[13px] font-medium leading-relaxed shadow-xl",
                        msg.sender === "vendor"
                          ? "bg-navy text-white rounded-tr-none shadow-navy/20"
                          : "bg-slate-bg dark:bg-slate-800 text-navy dark:text-white rounded-tl-none border border-navy/5",
                      )}
                    >
                      {msg.text}
                    </div>
                    <p
                      className={cn(
                        "text-[9px] font-black text-navy/20 mt-3 uppercase tracking-[0.2em]",
                        msg.sender === "vendor" ? "text-right" : "text-left",
                      )}
                    >
                      {msg.sender === "vendor" ? "Sent" : "Received"} •{" "}
                      {msg.time}
                    </p>
                  </div>
                ),
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-10 pt-0">
              <div className="bg-slate-bg dark:bg-slate-800 rounded-[2.5rem] p-3 pr-3 pl-8 flex items-center gap-4 border border-navy/5 shadow-inner focus-within:border-cyan/40 transition-all">
                <input
                  type="text"
                  placeholder="Direct communication to GMAA Backend..."
                  className="flex-1 bg-transparent border-none text-[13px] font-medium focus:ring-0 dark:text-white py-4"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSendMessage(true)
                  }
                />
                <button
                  onClick={() => handleSendMessage(true)}
                  className="bg-navy dark:bg-cyan text-white p-5 rounded-[2rem] hover:bg-brand-red transition-all shadow-2xl shadow-navy/20 active:scale-95 group"
                >
                  <Send
                    size={22}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInquiryDossier = () => {
    if (!selectedInquiry) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed inset-0 z-[100] bg-navy/60 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 lg:p-12"
      >
        <div className="bg-white dark:bg-slate-900 w-full max-w-7xl h-[calc(100dvh-1.5rem)] lg:h-full rounded-2xl md:rounded-[48px] overflow-hidden shadow-2xl flex flex-col border border-white/10">
          {/* Header */}
          <div className="bg-[#051622] p-4 md:p-8 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <div>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-0.5 md:mb-1 block">
                  Case Dossier • ID: {selectedInquiry.id}
                </span>
                <h2 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter">
                  {selectedInquiry.patientName}
                </h2>
              </div>
            </div>
            <div className="hidden sm:flex gap-4">
              <div className="px-4 py-2 bg-cyan/10 border border-cyan/20 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan">
                  Secure Session Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Messages */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-navy/5 dark:border-white/5 bg-slate-bg/30 dark:bg-slate-950/30 overflow-hidden h-1/2 lg:h-full">
              <div className="p-4 md:p-6 border-b border-navy/5 dark:border-white/5 flex justify-between items-center">
                <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-navy/40 dark:text-white/40">
                  Communication Lane
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
                {inquiryMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-20">
                    <MessageCircle size={48} className="mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest leading-loose">
                      Start direct communication regarding this inquiry...
                    </p>
                  </div>
                ) : (
                  inquiryMessages.map((msg: any, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[80%] flex flex-col",
                        msg.sender === "vendor" ? "self-end" : "self-start",
                      )}
                    >
                      <div
                        className={cn(
                          "px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
                          msg.sender === "vendor"
                            ? "bg-navy text-white rounded-tr-none"
                            : "bg-white dark:bg-slate-800 text-navy dark:text-white rounded-tl-none border border-navy/5 dark:border-white/5",
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-black text-navy/20 dark:text-white/20 uppercase mt-2 px-2">
                        {msg.senderName} • {msg.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="p-8 bg-white dark:bg-slate-900 border-t border-navy/5 dark:border-white/5">
                <div className="flex gap-4">
                  <input
                    placeholder="Type message to GMAA Backend..."
                    className="flex-1 bg-slate-bg dark:bg-slate-800 border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan/20 transition-all dark:text-white"
                    value={inquiryChatMsg}
                    onChange={(e) => setInquiryChatMsg(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendInquiryMessage()
                    }
                  />
                  <button
                    onClick={handleSendInquiryMessage}
                    className="bg-navy dark:bg-cyan text-white px-8 rounded-2xl flex items-center justify-center hover:bg-brand-red transition-all shadow-xl shadow-navy/20 active:scale-95"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Documents */}
            <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-navy/5 dark:border-white/5 h-1/2 lg:h-full">
              <div className="p-4 md:p-6 border-b border-navy/5 dark:border-white/5 flex justify-between items-center bg-slate-bg/50 dark:bg-slate-900/50">
                <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-navy/40 dark:text-white/40">
                  Dossier Vault
                </h3>
                <button
                  onClick={handleUploadDossierDoc}
                  disabled={isUploading}
                  className="p-1.5 md:p-2 bg-navy dark:bg-cyan text-white rounded-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
                {isUploading && (
                  <div className="p-6 bg-cyan/5 border border-dashed border-cyan/30 rounded-3xl flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-cyan rounded-xl flex items-center justify-center text-white">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-cyan">
                        Uploading...
                      </p>
                      <p className="text-[8px] font-bold text-cyan/40">
                        Encrypting Dossier
                      </p>
                    </div>
                  </div>
                )}
                {inquiryDocuments.length === 0 && !isUploading ? (
                  <div className="h-40 flex flex-col items-center justify-center opacity-10 text-center p-10">
                    <Paperclip size={32} className="mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest">
                      No documents stored
                    </p>
                  </div>
                ) : (
                  inquiryDocuments.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-5 bg-slate-bg dark:bg-slate-800 rounded-3xl border border-navy/5 dark:border-white/5 hover:border-cyan/30 transition-all group flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-navy/40 dark:text-white/40 group-hover:bg-cyan group-hover:text-white transition-all shadow-sm">
                        <Paperclip size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-navy dark:text-white uppercase truncate">
                          {doc.name}
                        </p>
                        <p className="text-[8px] font-bold text-navy/40 dark:text-white/40 uppercase mt-1">
                          {doc.size} • {doc.uploadedBy}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-8 border-t border-navy/5 dark:border-white/5 bg-slate-bg/20">
                <div className="space-y-4">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/40 mb-2">
                    Inquiry Metadata
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-navy/40 uppercase">Country</span>
                      <span className="text-navy dark:text-white">
                        {selectedInquiry.country}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-navy/40 uppercase">Treatment</span>
                      <span className="text-navy dark:text-white">
                        {selectedInquiry.treatment}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-navy/40 uppercase">Ref ID</span>
                      <span className="text-navy dark:text-white">
                        {selectedInquiry.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderInquiries = () => (
    <div className="p-8">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter">
            Full Inquiry List
          </h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Filter inquiries..."
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-navy text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Reports
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                  Patient
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                  Treatment
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                  Country
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                  Date
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                  Status
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredInquiries.map((inq) => (
                <tr
                  key={inq.id}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center font-bold text-navy dark:text-white text-xs">
                        {inq.patientName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-navy dark:text-white">
                        {inq.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-navy/60 dark:text-white/60 text-[10px] uppercase tracking-widest">
                    {inq.treatment}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{inq.flag}</span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {inq.country}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-xs text-slate-400">{inq.date}</td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]",
                        inq.status === "new"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : inq.status === "quoted"
                            ? "bg-cyan/10 text-cyan"
                            : "bg-navy/10 text-navy",
                      )}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="px-4 py-2 bg-navy text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-red transition-all"
                    >
                      Manage Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTenders = () => (
    <div className="p-8">
      <div className="bg-white/50 dark:bg-slate-900/40 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tighter">
              Market Tenders
            </h3>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
              Global institutional opportunities
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              Bridge Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tenders.map((tender: any) => (
            <div
              key={tender.id}
              onClick={() => setSelectedTender(tender)}
              className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6 gap-4">
                <div className="min-w-0 flex-1">
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-cyan bg-cyan/5 px-2 py-1 rounded-lg">
                    ID: {tender.id} • {tender.category}
                  </span>
                  <h4 className="text-lg md:text-xl font-black text-navy dark:text-white mt-4 leading-tight uppercase italic truncate">
                    {tender.service}
                  </h4>
                </div>
                <div className="shrink-0">
                  {myBidTenderIds.includes(tender.id) ? (
                    <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg flex items-center gap-2 px-3">
                      <CheckCircle2 size={12} />
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        Active Bid
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-brand-red bg-brand-red/5 px-3 py-1 rounded-xl">
                      <Clock size={12} />
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tight whitespace-nowrap">
                        {tender.deadline || "7 days left"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-navy/40 dark:text-white/40">
                  <MapPin size={12} />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    {tender.region}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-navy/40 dark:text-white/40">
                  <CreditCard size={12} />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    Target: {tender.budget}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-700/50 flex flex-wrap gap-4 items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTender(tender);
                  }}
                  className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-navy dark:text-white bg-slate-bg dark:bg-slate-700 px-5 md:px-6 py-2.5 md:py-3 rounded-xl hover:bg-navy dark:hover:bg-cyan hover:text-white transition-all shadow-sm"
                >
                  View Intel & Bid
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTender(tender);
                    setIsShieldOpen(true);
                  }}
                  className="w-10 h-10 md:w-12 md:h-12 border border-navy/10 dark:border-white/10 rounded-xl flex items-center justify-center text-navy/20 dark:text-white/20 hover:text-brand-red transition-all"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex h-screen bg-slate-bg text-navy transition-colors duration-300 relative overflow-hidden",
        darkMode ? "bg-slate-950 text-white" : "",
      )}
    >
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-80 bg-navy flex flex-col pt-12 border-r border-white/5 z-[60] shrink-0 shadow-2xl shadow-navy/20 transition-transform duration-500 lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-10 mb-16">
          <div className="flex items-center gap-4">
            <div 
              onClick={onHome}
              className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center shadow-lg shadow-brand-red/30 group cursor-pointer hover:rotate-12 transition-transform"
            >
              <Activity className="text-white animate-pulse-slow" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black tracking-tight text-xl leading-none">
                MAA <span className="text-cyan italic">CORE</span>
              </span>
              <span className="text-[9px] font-black text-white/30 mt-1 tracking-[0.3em] uppercase">
                Security Node Alpha
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {[
            { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
            {
              id: "inquiries",
              label: "Active Cases",
              icon: Users,
              badge: filteredInquiries.length,
            },
            { id: "tenders", label: "Global Tenders", icon: Gavel },
            { id: "analytics", label: "Visibility Intel", icon: BarChart3 },
            { id: "profile", label: "Facility Profile", icon: Hospital },
            { id: "billing", label: "Financials", icon: CreditCard },
            { id: "support", label: "GMAA Support", icon: LifeBuoy },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                activeTab === item.id
                  ? "bg-cyan text-white shadow-lg shadow-cyan/20"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={18}
                  className={
                    activeTab === item.id
                      ? "text-white"
                      : "group-hover:scale-110 transition-transform"
                  }
                />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-brand-red text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=100&h=100&fit=crop"
                  alt="User"
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-white">
                  St. Luke's Medical
                </p>
                <p className="text-[10px] text-white/40">Bangkok, Thailand</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        {/* Header - Mission Control Interface */}
        <header className="h-28 md:h-32 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-navy/5 dark:border-white/5 px-4 md:px-10 flex items-center pt-6 md:pt-0 justify-between sticky top-0 z-40 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-navy dark:text-white hover:bg-slate-bg dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative flex-1 lg:w-[400px] max-w-md group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/20 dark:text-white/20 group-focus-within:text-cyan transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="PROXIMITY SEARCH [ALT+S]"
                className="w-full bg-slate-bg dark:bg-white/5 border border-navy/5 dark:border-white/5 rounded-2xl py-3.5 pl-14 pr-6 text-[11px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-cyan/20 focus:border-cyan/30 transition-all dark:text-white placeholder:text-navy/20 dark:placeholder:text-white/20 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* System Status Indicators */}
            <div className="hidden lg:flex items-center gap-6 border-l border-navy/5 dark:border-white/5 pl-8">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-navy/30 dark:text-white/20 uppercase tracking-widest leading-none mb-1.5">
                  Node Status
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter italic">
                    Operational
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-navy/30 dark:text-white/20 uppercase tracking-widest leading-none mb-1.5">
                  Encryption
                </span>
                <div className="flex items-center gap-2">
                  <Shield size={10} className="text-cyan" />
                  <span className="text-[10px] font-black text-cyan uppercase tracking-tighter italic">
                    AES-256 Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {onViewProfile && profile?.uid && (
              <button
                onClick={() => onViewProfile(profile.uid)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-xl hover:bg-cyan transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <Eye size={16} />
                Preview Profile
              </button>
            )}
            <div className="flex items-center gap-3 bg-slate-bg dark:bg-white/5 p-1.5 rounded-2xl border border-navy/5">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-white dark:bg-slate-800 rounded-xl hover:shadow-lg transition-all text-navy dark:text-white border border-navy/5"
              >
                {darkMode ? (
                  <Sun size={18} className="text-cyan" />
                ) : (
                  <Moon size={18} className="text-navy" />
                )}
              </button>
              <div className="relative">
                <button className="p-3 bg-white dark:bg-slate-800 rounded-xl hover:shadow-lg transition-all text-navy dark:text-white border border-navy/5 group">
                  <Bell size={18} />
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                </button>
              </div>
            </div>

            <div className="h-10 w-px bg-navy/5 dark:bg-white/5 mx-2" />

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black uppercase text-navy dark:text-white tracking-tight leading-none mb-1 italic">
                  {profile?.displayName || "Hospital Admin"}
                </p>
                <p className="text-[9px] text-navy/30 dark:text-white/30 font-black uppercase tracking-[0.2em]">
                  {profile?.location || "Level 4"} Node Access
                </p>
              </div>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-navy flex items-center justify-center text-white text-base font-black shadow-xl shadow-navy/30 group-hover:rotate-6 transition-transform relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {(profile?.displayName || "HA")
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-950 shadow-sm" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "inquiries" && renderInquiries()}
            {activeTab === "tenders" && renderTenders()}
            {activeTab === "support" && renderSupport()}
            {activeTab !== "dashboard" &&
              activeTab !== "inquiries" &&
              activeTab !== "tenders" &&
              activeTab !== "support" && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40 py-32">
                  <Hospital size={64} className="mb-4" />
                  <h3 className="text-xl font-black uppercase tracking-widest">
                    {activeTab} View
                  </h3>
                  <p className="text-[10px] font-bold mt-2 tracking-widest uppercase italic">
                    Implementation in progress by medical logistics team
                  </p>
                </div>
              )}
          </motion.div>
        </AnimatePresence>

        {/* Detailed Modal/Overlays */}
        <AnimatePresence>
          {selectedInquiry && renderInquiryDossier()}
          {selectedTender && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTender(null)}
                className="absolute inset-0 bg-navy/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-4xl rounded-[28px] md:rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col h-[calc(100dvh-1.5rem)] sm:h-[90vh]"
              >
                <div className="p-10 bg-white border-b border-navy/5 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-brand-red/20">
                      T
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold uppercase tracking-tighter text-navy uppercase">
                        Auction Interface • {selectedTender.id}
                      </h3>
                      <p className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.4em]">
                        Secure Institutional Bidding Environment
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTender(null)}
                    className="p-3 bg-slate-bg hover:bg-slate-200 rounded-2xl transition-all text-navy"
                  >
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 bg-slate-bg/30">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Tender Info */}
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-brand-red">
                          Proposed Service Package
                        </h4>
                        <h2 className="text-4xl font-bold text-navy uppercase tracking-tighter leading-none">
                          {selectedTender.service}
                        </h2>
                        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[24px] border border-navy/5 shadow-sm">
                          <p className="text-base font-medium text-navy/80 leading-relaxed">
                            {selectedTender.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm">
                          <p className="text-[9px] font-black uppercase tracking-widest text-navy/40 mb-2">
                            Deadline
                          </p>
                          <p className="text-xl font-black text-brand-red italic">
                            {selectedTender.deadline}
                          </p>
                        </div>
                      </div>

                      {selectedTender.requirements &&
                        selectedTender.requirements.length > 0 && (
                          <div className="p-8 bg-navy/[0.02] rounded-[32px] border border-navy/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-6 flex items-center gap-2 relative z-10">
                              <Users size={14} className="text-navy/60" /> Case
                              Requirements
                            </h5>
                            <ul className="space-y-4 relative z-10">
                              {selectedTender.requirements.map(
                                (req: string, idx: number) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-3 text-[11px] font-bold text-navy/80"
                                  >
                                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-red shrink-0" />
                                    {req}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      <button
                        onClick={() => setIsShieldOpen(true)}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-brand-red/20 bg-brand-red/10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-red transition-all hover:bg-brand-red hover:text-white active:scale-95"
                      >
                        <MessageSquare size={14} /> Connect with Team
                      </button>
                    </div>

                    {/* Right: Bidding Form */}
                    <div className="bg-white p-10 rounded-[40px] border border-navy/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-3xl rounded-full" />
                      <div className="flex justify-between items-center mb-8 border-b border-navy/5 pb-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-navy">
                          Establish Vendor Bid
                        </h4>
                        {existingBidId && (
                          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                            Existing Bid Active
                          </div>
                        )}
                      </div>

                      <div className="space-y-8 relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-bg p-4 rounded-2xl border border-navy/5 text-center">
                            <p className="text-[8px] font-black uppercase tracking-widest text-navy/40 mb-1">
                              Lowest Market Bid
                            </p>
                            <p className="text-lg font-black text-navy italic">
                              {bestBidPrice
                                ? `$${bestBidPrice.toLocaleString()}`
                                : "--"}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "p-4 rounded-2xl border text-center transition-all",
                              existingBidId &&
                                bestBidPrice &&
                                Number(bidPrice) > bestBidPrice
                                ? "bg-brand-red/5 border-brand-red/20"
                                : "bg-emerald-500/5 border-emerald-500/20",
                            )}
                          >
                            <p className="text-[8px] font-black uppercase tracking-widest text-navy/40 mb-1">
                              Your Standing
                            </p>
                            <p
                              className={cn(
                                "text-lg font-black italic",
                                existingBidId &&
                                  bestBidPrice &&
                                  Number(bidPrice) > bestBidPrice
                                  ? "text-brand-red"
                                  : "text-emerald-500",
                              )}
                            >
                              {!existingBidId
                                ? "--"
                                : bestBidPrice &&
                                    Number(bidPrice) > bestBidPrice
                                  ? "Outbid"
                                  : "Leading"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-3 block">
                            Proposed Unit/Package Price (USD)
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20 font-black">
                              $
                            </div>
                            <input
                              type="number"
                              placeholder="e.g. 12500"
                              value={bidPrice}
                              onChange={(e) => setBidPrice(e.target.value)}
                              className="w-full bg-slate-bg border-none rounded-2xl p-4 pl-10 text-xs font-bold focus:ring-2 focus:ring-navy/5 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-3 block">
                            Primary Surgeon / Lead Profile
                          </label>
                          <input
                            placeholder="e.g. Dr. Michael Chen (Senior Specialist)"
                            value={surgeonName}
                            onChange={(e) => setSurgeonName(e.target.value)}
                            className="w-full bg-slate-bg border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-navy/5 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-3 block">
                            Inclusions & Value Adds
                          </label>
                          <textarea
                            placeholder="Specify VIP perks, recovery suites, pickup services..."
                            value={inclusions}
                            onChange={(e) => setInclusions(e.target.value)}
                            className="w-full bg-slate-bg border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-navy/5 outline-none min-h-[100px]"
                          />
                        </div>

                        <div className="pt-4">
                          <button
                            onClick={handleTransmitBid}
                            disabled={isBidding}
                            className={cn(
                              "w-full py-5 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all shadow-xl shadow-navy/20 active:scale-95",
                              isBidding
                                ? "bg-navy/50 cursor-wait"
                                : "bg-navy hover:bg-brand-red",
                            )}
                          >
                            {isBidding
                              ? "Transmitting Intelligence..."
                              : existingBidId
                                ? "Update Bid Quotation"
                                : "Bid Initial Quote"}
                          </button>
                          <p className="text-[8px] font-black text-navy/20 uppercase text-center mt-4 tracking-widest">
                            Signed & Encrypted • Institutional Terms Apply
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Shield Proxy Chat Bridge */}
        <AnimatePresence>
          {isShieldOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <div
                onClick={() => setIsShieldOpen(false)}
                className="absolute inset-0 bg-navy/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[28px] md:rounded-[48px] overflow-hidden relative shadow-2xl flex flex-col h-[calc(100dvh-1.5rem)] sm:h-[70vh]"
              >
                <div className="p-8 bg-[#051622] text-white flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center font-bold text-white text-xs border border-white/20">
                      GMAA
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tighter text-white">
                        Shield Bridge • GMAA Relay
                      </h3>
                      <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.4em]">
                        Proxy Communication Instance • Alpha Lane
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsShieldOpen(false)}
                    className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest"
                  >
                    Terminate Bridge
                  </button>
                </div>

                <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="p-6 bg-slate-bg/30 dark:bg-slate-800/50 border-b border-navy/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                      Secure Relay: Hospital ⇌ GMAA Admin
                    </span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {(messages.length > 0 ? messages : CHAT_MOCK).map(
                      (msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex flex-col text-white",
                            msg.sender === "vendor"
                              ? "items-end"
                              : "items-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] p-5 rounded-3xl text-[12px] font-bold leading-relaxed",
                              msg.sender === "vendor"
                                ? "bg-[#2C74B3] text-white rounded-tr-none shadow-xl shadow-navy/10"
                                : "bg-slate-bg dark:bg-slate-800 text-navy dark:text-white rounded-tl-none",
                            )}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[8px] font-black text-navy/20 dark:text-white/20 uppercase mt-2 px-2">
                            {msg.sender === "vendor"
                              ? profile?.displayName || "Hospital Admin"
                              : "GMAA System Operator"}{" "}
                            • {msg.time}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="p-8 bg-slate-bg/30 dark:bg-slate-800/50 border-t border-navy/5">
                    <div className="flex gap-4">
                      <input
                        placeholder="Transmit secure intel to GMAA Bridge..."
                        className="flex-1 bg-white dark:bg-slate-900 border-none rounded-2xl p-5 text-xs font-bold outline-none shadow-sm dark:text-white"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        className="bg-navy dark:bg-cyan text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-navy/20 active:scale-95 transition-all"
                      >
                        Relay intel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const InquiryDetailModal = ({
  inquiry,
  onClose,
}: {
  inquiry: Inquiry | null;
  onClose: () => void;
}) => {
  if (!inquiry) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] rounded-3xl shadow-2xl relative overflow-y-auto flex flex-col"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-2xl text-navy dark:text-white">
              {inquiry.patientName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tighter">
                {inquiry.patientName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{inquiry.flag}</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize">
                  {inquiry.country} • Case #{inquiry.id}
                  {Math.floor(Math.random() * 1000)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        <div className="p-8 space-y-8 flex-1 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                Treatment Requested
              </h4>
              <p className="text-sm font-bold text-navy dark:text-white">
                {inquiry.treatment}
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
                Inquiry Date
              </h4>
              <p className="text-sm font-bold text-navy dark:text-white">
                {inquiry.date}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/40 dark:text-white/40">
              Patient Brief
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Patient is seeking {inquiry.treatment.toLowerCase()} services.
              Initial screening shows no contraindications. Interested in
              hospital's advanced recovery suite and robotic assistance if
              available. GlobalMAA verification score: 98/100.
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-100/5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-navy dark:text-white">
                  Verified Intent
                </h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Financial clearance confirmed by GlobalMAA.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <button className="flex-1 py-4 bg-navy dark:bg-cyan text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-navy/20">
            Submit Medical Quote
          </button>
          <button className="px-6 py-4 border border-navy/10 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] text-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            Request Tele-Consult
          </button>
        </div>
      </motion.div>
    </div>
  );
}

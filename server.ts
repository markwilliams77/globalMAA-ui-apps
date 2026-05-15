import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from 'resend';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Note: In a real app, you'd use a service account for Admin SDK.
// For this environment, we'll focus on the logic flow.
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route: Post Tender & Broadcast
  app.post("/api/tenders", async (req, res) => {
    const { tenderData, vendorEmails } = req.body;

    try {
      const isSimulation = !process.env.RESEND_API_KEY || process.env.ENABLE_MAIL_LIVE !== 'true';
      
      console.log(`[Tender Engine] Posting new tender: ${tenderData.service}`);
      console.log(`[Tender Engine] Mode: ${isSimulation ? 'SIMULATION' : 'LIVE'}`);
      
      // 1. In a production app, you would save to Firestore here using Admin SDK
      // const tenderRef = await db.collection('tenders').add({ ...tenderData, createdAt: new Date() });

      // 2. Broadcast to Vendors
      if (!isSimulation) {
        console.log(`[Notification] Dispatching LIVE emails to ${vendorEmails.length} vendors...`);
        
        await resend.emails.send({
          from: 'GMAA Alliance <notifications@gmaa.alliance>',
          to: vendorEmails,
          subject: `New Opportunity: ${tenderData.service} Tender`,
          html: `
            <div style="font-family: sans-serif; color: #0A111F;">
              <h2 style="color: #FF3B30;">New Medical Tender Opportunity</h2>
              <p>A new tender has been posted in your region for <strong>${tenderData.service}</strong>.</p>
              <div style="padding: 20px; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                <p><strong>Region:</strong> ${tenderData.region}</p>
                <p><strong>Budget:</strong> ${tenderData.budget}</p>
                <p><strong>Deadline:</strong> ${tenderData.deadline}</p>
                <p><strong>Details:</strong> ${tenderData.description}</p>
              </div>
              <p style="margin-top: 20px;">Please log in to the GMAA Vendor Portal to submit your bid.</p>
            </div>
          `
        });
      } else {
        console.warn(`[Simulation] ${!process.env.RESEND_API_KEY ? 'RESEND_API_KEY missing.' : 'Live mail disabled.'} Simulating broadcast...`);
        vendorEmails.forEach((email: string) => {
          console.log(`[SIMULATED MAIL SENT] To: ${email} | Subject: New Tender posted`);
        });
      }

      res.status(200).json({ 
        success: true, 
        message: isSimulation ? "Tender posted (Simulation Mode: Check server logs for broadcast details)" : "Tender posted and broadcast initiated.",
        simulated: isSimulation 
      });

    } catch (error) {
      console.error("Broadcast failed:", error);
      res.status(500).json({ error: "Failed to process tender broadcast" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

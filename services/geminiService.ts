import { GoogleGenAI } from "@google/genai";

// This service handles integration with Gemini for fleet optimization insights
// Includes MOCK FALLBACKS for demo reliability.

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string = '';

  constructor() {
    if (process.env.API_KEY) {
        this.updateApiKey(process.env.API_KEY);
    }
  }

  public updateApiKey(key: string) {
      if (key && key !== this.apiKey) {
          this.apiKey = key;
          this.ai = new GoogleGenAI({ apiKey: key });
      }
  }

  // --- MOCK GENERATORS FOR DEMO STABILITY ---
  private getMockDelayAnalysis() {
      const reasons = [
          "Heavy congestion detected on SLEX near Alabang Viaduct due to ongoing roadworks.",
          "Unexpected weather conditions causing reduced visibility and slower average fleet speed.",
          "Driver took a mandatory rest stop to comply with safety regulations.",
          "Minor mechanical anomaly reported in tire pressure monitoring system, requiring safety check."
      ];
      return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private getMockCostSummary() {
      return "Efficiency Rating: High. Fuel consumption is 5% below fleet average for this route. Toll costs are within budget. Suggest maintaining current route for future trips.";
  }

  private getMockDriverSuggestion(jobId: number) {
      // Deterministic mock based on Job ID
      const drivers = [
          { id: 1, name: "R. Magsaysay", reason: "Best performance rating (4.9) and closest to pickup." },
          { id: 6, name: "V. Navarro", reason: "Vehicle type match and high HOS availability." }
      ];
      const match = jobId % 2 === 0 ? drivers[1] : drivers[0];
      return JSON.stringify({ recommendedDriverId: match.id, reason: match.reason });
  }

  private getMockReceiptParse(type: 'fuel' | 'expense') {
      if (type === 'fuel') {
          return {
              station: "Shell SLEX Southbound",
              liters: 45.5,
              price: 68.50,
              total: 3116.75,
              date: new Date().toLocaleTimeString(),
              confidence: 0.98
          };
      } else {
          return {
              category: "Maintenance",
              description: "Coolant Top-up & Wiper Blade",
              amount: 850.00,
              date: new Date().toLocaleTimeString(),
              confidence: 0.95
          };
      }
  }

  // --- PUBLIC METHODS ---

  async analyzeDelayReasons(delayReportText: string): Promise<string | undefined> {
    if (!this.ai) {
        await new Promise(r => setTimeout(r, 1500)); // Simulate network delay
        return this.getMockDelayAnalysis();
    }
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-preview',
        contents: `Analyze the following driver delay report and suggest 3 key operational improvements. Report: ${delayReportText}`,
      });
      return response.text;
    } catch (error) {
      console.warn("Gemini API Error (Falling back to mock):", error);
      return this.getMockDelayAnalysis();
    }
  }

  async generateCostSummary(tripData: any): Promise<string | undefined> {
    if (!this.ai) {
        await new Promise(r => setTimeout(r, 1200));
        return this.getMockCostSummary();
    }

     try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-preview',
        contents: `Summarize the cost efficiency of this trip based on the data: ${JSON.stringify(tripData)}. Keep it under 50 words. Focus on outliers.`,
      });
      return response.text;
    } catch (error) {
      console.warn("Gemini API Error (Falling back to mock):", error);
      return this.getMockCostSummary();
    }
  }

  async suggestDriverAssignment(jobDetails: any, availableDrivers: any[]): Promise<string | undefined> {
    if (!this.ai) {
        await new Promise(r => setTimeout(r, 1000));
        return this.getMockDriverSuggestion(jobDetails.id);
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-preview',
        contents: `
          Act as a logistics dispatcher.
          Job Details: ${JSON.stringify(jobDetails)}
          Available Drivers: ${JSON.stringify(availableDrivers)}
          
          Task: Recommend the best driver for this job. 
          Return ONLY a JSON object (no markdown) with this format:
          { "recommendedDriverId": number, "reason": "string reasoning" }
        `,
        config: {
            responseMimeType: "application/json"
        }
      });
      return response.text;
    } catch (error) {
      console.warn("Gemini API Error (Falling back to mock):", error);
      return this.getMockDriverSuggestion(jobDetails.id);
    }
  }

  async parseReceiptImage(type: 'fuel' | 'expense'): Promise<any> {
      // In a real app, this would accept a base64 string and send it to Gemini 1.5 Flash
      await new Promise(r => setTimeout(r, 2000)); // Simulate processing time
      return this.getMockReceiptParse(type);
  }

  async chatSupport(message: string, context: string): Promise<string> {
      if (!this.ai) {
          await new Promise(r => setTimeout(r, 1000));
          return "I'm currently running in Demo Mode (Offline). I can help you navigate the dashboard, but I can't process complex live data queries right now.";
      }

      try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash-preview',
            contents: `
                System: You are an expert fleet management support agent for RVL Movers.
                Context: ${context}
                User: ${message}
                
                Keep answers concise, helpful, and professional.
            `
        });
        return response.text || "I couldn't process that request.";
      } catch (error) {
          return "Sorry, I encountered an error connecting to the knowledge base.";
      }
  }

  async predictMaintenance(vehicleName: string, telematicsData: any[]): Promise<string> {
      if (!this.ai) {
          await new Promise(r => setTimeout(r, 2000));
          return "Analysis Complete: Slight vibration detected in rear axle (Sensor ID: AX-99). Recommend inspection within 500km.";
      }

      try {
          const response = await this.ai.models.generateContent({
              model: 'gemini-2.5-flash-preview',
              contents: `
                Act as a senior mechanic. Analyze the following telematics data (Speed, Consumption, Time) for ${vehicleName}. 
                Data: ${JSON.stringify(telematicsData)}.
                Identify any irregular patterns that might indicate engine, brake, or transmission issues. 
                Keep it brief (max 2 sentences).
              `
          });
          return response.text || "No issues detected.";
      } catch (e) {
          return "Unable to process telematics data.";
      }
  }

  async analyzeFleetPerformance(metrics: any): Promise<string> {
      if (!this.ai) {
          await new Promise(r => setTimeout(r, 2500));
          return "Executive Summary: Fleet utilization is up 12% week-over-week. Fuel costs have stabilized, though maintenance expenses are trending slightly higher due to aging units in the North sector. Recommendation: Rotate drivers on the SLEX route to balance fatigue levels.";
      }

      try {
          const response = await this.ai.models.generateContent({
              model: 'gemini-2.5-flash-preview',
              contents: `
                Act as a Fleet Manager Executive. Write a concise, professional summary of this week's fleet performance.
                Metrics: ${JSON.stringify(metrics)}.
                Highlight cost efficiency, driver performance, and 1 recommendation for next week.
              `
          });
          return response.text || "Report generation failed.";
      } catch (e) {
          return "Unable to generate report.";
      }
  }
}

export const geminiService = new GeminiService();
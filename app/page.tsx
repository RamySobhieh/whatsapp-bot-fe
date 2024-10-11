"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useState } from "react";
import { sendWhatsAppMessages } from "./api/whatsapp";

export default function Home() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [startRow, setStartRow] = useState<number>(0);
  const [endRow, setEndRow] = useState<number>(1000);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile || !message) {
      alert("Please upload an Excel file and enter a message.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("excel", excelFile);
    formData.append("message", message);
    formData.append("startRow", startRow.toString());
    formData.append("endRow", endRow.toString());

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    try {
      await sendWhatsAppMessages(formData);
      alert("Messages sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>WhatsApp Bulk Sender</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="excel">Upload Excel File</Label>
            <Input
              id="excel"
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div>
            <Label htmlFor="images">Upload Images (optional)</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </div>
          <div>
            <Label htmlFor="startRow">Start Row</Label>
            <Input
              id="startRow"
              type="number"
              value={startRow}
              onChange={(e) => setStartRow(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="endRow">End Row</Label>
            <Input
              id="endRow"
              type="number"
              value={endRow}
              onChange={(e) => setEndRow(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send Messages"}
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

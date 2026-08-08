import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface FeedbackEmailProps {
  username?: string;
  email?: string;
  feedback?: string;
  logoUrl?: string;
}

export const FeedbackEmail = ({
  username = "Shawn Rimai",
  email = "cashcanopydev@gmail.com",
  feedback = "The expense breakdown on the dashboard is amazing! Would love to see budget alerts next.",
  logoUrl = "https://cashcanopy.dev/favicon.ico",
}: FeedbackEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Cash Canopy Feedback from {username}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Top Bar Accent */}
          <Section style={topBar} />

          <Section style={content}>
            {/* Header Header Row */}
            <Row style={headerRow}>
              <Column style={{ width: "36px" }}>
                <Img
                  src={logoUrl}
                  width="32"
                  height="32"
                  alt="Cash Canopy"
                  style={logo}
                />
              </Column>
              <Column>
                <Heading style={title}>Cash Canopy</Heading>
              </Column>
              <Column align="right">
                <Text style={badge}>FEEDBACK</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            {/* User Details Meta Card */}
            <Section style={card}>
              <Row style={{ marginBottom: "12px" }}>
                <Column>
                  <Text style={label}>From User</Text>
                  <Text style={value}>{username}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={label}>Email Address</Text>
                  <Text style={emailValue}>{email}</Text>
                </Column>
              </Row>
            </Section>

            {/* Message Content */}
            <Text style={sectionHeader}>Feedback Message</Text>
            <Section style={messageBox}>
              <Text style={messageText}>&quot;{feedback}&quot;</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default FeedbackEmail;

// --- STYLES ---

const main = {
  backgroundColor: "#f4f5f7",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "20px 0",
};

const container = {
  margin: "0 auto",
  maxWidth: "560px",
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  overflow: "hidden" as const,
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
};

const topBar = {
  height: "5px",
  width: "100%",
  backgroundColor: "#10b981", // Fallback color for email clients without gradient support
  backgroundImage: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)",
};

const content = {
  padding: "32px 24px",
};

const headerRow = {
  width: "100%",
};

const logo = {
  borderRadius: "8px",
  display: "block",
};

const title = {
  fontSize: "20px",
  fontWeight: "700" as const,
  color: "#0f172a",
  margin: "0 0 0 10px",
  padding: 0,
};

const badge = {
  backgroundColor: "#ecfdf5",
  color: "#059669",
  fontSize: "11px",
  fontWeight: "700" as const,
  padding: "4px 10px",
  borderRadius: "9999px",
  letterSpacing: "0.5px",
  display: "inline-block",
  margin: 0,
};

const hr = {
  borderColor: "#f1f5f9",
  margin: "24px 0",
};

const card = {
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  padding: "16px 20px",
  marginBottom: "24px",
};

const label = {
  fontSize: "11px",
  fontWeight: "600" as const,
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 2px 0",
};

const value = {
  fontSize: "15px",
  fontWeight: "600" as const,
  color: "#0f172a",
  margin: 0,
};

const emailValue = {
  fontSize: "14px",
  fontWeight: "500" as const,
  color: "#2563eb",
  margin: 0,
};

const sectionHeader = {
  fontSize: "11px",
  fontWeight: "700" as const,
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px 0",
};

const messageBox = {
  backgroundColor: "#f8fafc",
  borderLeft: "4px solid #10b981",
  borderTop: "1px solid #e2e8f0",
  borderRight: "1px solid #e2e8f0",
  borderBottom: "1px solid #e2e8f0",
  borderRadius: "0 8px 8px 0",
  padding: "18px 20px",
};

const messageText = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#334155",
  fontStyle: "italic" as const,
  margin: 0,
};
"use client";

import { createGoal } from "@/app/actions/goals";
import React, { useState } from "react";

export default function GoalsClient() {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState<"active" | "achieved" | "paused">("active");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  return (
    <></>
  );
}
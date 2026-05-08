"use client";

import React from "react";

import Editor from "@/components/Editor";
import MobileViewer from "@/components/MobileViewer";
import { useIsMobile } from "@/hooks/useIsMobile";

const Home = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileViewer /> : <Editor />;
};

export default Home;

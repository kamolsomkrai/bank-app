"use client";

import { useState } from "react";
import { useSearchCustomer } from "@/hooks/useSearchCustomer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function CustomerSearchForm() {
  const [keyword, setKeyword] = useState("");

  const { data, isLoading, refetch } = useSearchCustomer(keyword);

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="space-y-4">
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="ค้นหา..." />
      <Button onClick={handleSearch}>ค้นหา</Button>

      {isLoading && <div>Loading...</div>}

      {data && (
        <div className="p-4 bg-gray-100 rounded mt-4 space-y-2">
          <p><strong>ชื่อ:</strong> {data.firstName} {data.lastName}</p>
          <p><strong>เบอร์โทร:</strong> {data.phone}</p>
          <p><strong>อีเมล:</strong> {data.email}</p>
        </div>
      )}
    </div>
  );
}

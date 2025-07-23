import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductCard from "../src/components/ProductCard"; 

// Mock data 
const mockProduct = {
  product_name: "iPhone 14",
  platform: "Amazon",
  image_url: "https://example.com/image.jpg",
  specs: {
    Storage: "128GB",
    Color: "Blue",
  },
  cb_score: 8.5,
  cb_level: "High",
  mb_score: 7.2,
  retailers: [
    {
      platform: "Amazon",
      price: 799,
      delivery_cost: 5,
      rating: 4.5,
      cb_score: 8.5,
      cb_level: "High",
      mb_score: 7.2,
      mb_level: "Moderate",
    },
  ],
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockProduct),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders loading state initially", async () => {
  render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <Routes>
        <Route path="/products/:id" element={<ProductCard />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("renders product information after fetch", async () => {
  render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <Routes>
        <Route path="/products/:id" element={<ProductCard />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for product name to appear
  await waitFor(() =>
    expect(screen.getByText(/iPhone 14/i)).toBeInTheDocument()
  );

  // Check for key product info
  expect(screen.getByText(/platform: amazon/i)).toBeInTheDocument();
  expect(screen.getByText(/storage:/i)).toBeInTheDocument();
  expect(screen.getByText(/color:/i)).toBeInTheDocument();
  expect(screen.getByText(/cb score: 8.5/i)).toBeInTheDocument();
  expect(screen.getByText(/mb score: 7.2/i)).toBeInTheDocument();
  expect(screen.getByText(/compare with other retailers/i)).toBeInTheDocument();
  expect(screen.getByText("$799")).toBeInTheDocument();
});

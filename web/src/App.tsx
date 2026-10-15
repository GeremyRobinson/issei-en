import { Navigate, Outlet, Route, Routes, useParams } from "react-router";
import { Header } from "./components/Header";
import { Cart } from "./components/Cart";
import Information from "./pages/Information";
import IndexPage from "./pages/IndexPage";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

function Layout() {
  return (
    <div className="page">
      <Header />
      <main>
        <Outlet />
      </main>
      <Cart />
    </div>
  );
}

/** The shop is now part of the Index; old shop links and QR codes land on the same tea. */
function ShopRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/index/${slug}` : "/index"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Information />} />
        <Route path="index/pricing" element={<Pricing />} />
        <Route path="pricing" element={<Navigate to="/index/pricing" replace />} />
        <Route path="index/index" element={<Navigate to="/index" replace />} />
        <Route path="index/:slug?" element={<IndexPage />} />
        <Route path="shop/:slug?" element={<ShopRedirect />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

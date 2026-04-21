import ProductList from "../API/product";
import NavBar from "../navBar/navBar";
export default function Home() {
  return (
    <>
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="mt-8 text-2xl font-bold">Ads product</h1>
        <div className=" "><h1>product</h1>
        <ProductList/>
        
          </div>
      </div>
    </>
  );
}
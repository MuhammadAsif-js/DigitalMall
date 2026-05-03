import PrimaryButton from "../components/ui/PrimaryButton";
import TextInput from "../components/ui/TextInput";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-10">
      <h1 className="text-2xl font-bold">Component Test Station</h1>
      
      {/* Testing the Inputs */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <TextInput 
          label="Product Barcode" 
          placeholder="Scan or type barcode..." 
        />
        <TextInput 
          label="Price" 
          placeholder="0.00" 
          error="Price cannot be empty" 
        />
      </div>

      {/* Testing the Buttons */}
      <div className="flex gap-4">
        <PrimaryButton variant="primary">Add Product</PrimaryButton>
        <PrimaryButton variant="secondary">Cancel</PrimaryButton>
      </div>
    </div>
  );
}
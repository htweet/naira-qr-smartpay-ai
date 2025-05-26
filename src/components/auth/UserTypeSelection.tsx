
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Smartphone } from "lucide-react";

interface UserTypeSelectionProps {
  userType: 'merchant' | 'customer';
  onUserTypeChange: (type: 'merchant' | 'customer') => void;
}

const UserTypeSelection = ({ userType, onUserTypeChange }: UserTypeSelectionProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Choose Your Account Type</h3>
        <p className="text-gray-600 text-sm">
          Select the account type that best describes your use case
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            userType === 'merchant' 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => onUserTypeChange('merchant')}
        >
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Merchant</CardTitle>
            <CardDescription className="text-sm">
              Accept payments from customers
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Generate QR codes</li>
              <li>• Accept payments</li>
              <li>• Business analytics</li>
              <li>• Multi-gateway support</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            userType === 'customer' 
              ? 'ring-2 ring-green-500 bg-green-50' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => onUserTypeChange('customer')}
        >
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Customer</CardTitle>
            <CardDescription className="text-sm">
              Make payments by scanning QR codes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Scan QR codes</li>
              <li>• Make payments</li>
              <li>• Payment history</li>
              <li>• Spending analytics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserTypeSelection;

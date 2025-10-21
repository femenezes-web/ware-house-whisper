import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Product {
  code: string;
  description: string;
}

interface ProductSearchInputProps {
  value: string;
  onSelect: (code: string, description: string) => void;
  products: Product[];
  placeholder?: string;
}

export const ProductSearchInput = ({ 
  value, 
  onSelect, 
  products,
  placeholder = "Buscar produto..."
}: ProductSearchInputProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Get unique products (by code)
  const uniqueProducts = Array.from(
    new Map(products.map(p => [p.code, p])).values()
  );

  const handleSelect = (product: Product) => {
    const displayValue = `${product.code} - ${product.description}`;
    setSearchValue(displayValue);
    onSelect(product.code, product.description);
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue);
    
    // If user clears or modifies, parse the input
    if (newValue.includes(' - ')) {
      const [code, description] = newValue.split(' - ');
      onSelect(code.trim(), description.trim());
    } else {
      // User is typing a new product
      onSelect(newValue, newValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {searchValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={placeholder}
            value={searchValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>Nenhum produto encontrado. Digite para criar novo.</CommandEmpty>
            <CommandGroup>
              {uniqueProducts.map((product) => (
                <CommandItem
                  key={product.code}
                  value={`${product.code} - ${product.description}`}
                  onSelect={() => handleSelect(product)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      searchValue === `${product.code} - ${product.description}` 
                        ? "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{product.code}</span>
                    <span className="text-sm text-muted-foreground">
                      {product.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

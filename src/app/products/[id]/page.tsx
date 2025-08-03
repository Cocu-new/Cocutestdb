
"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { mockProducts, mockReviews, mockCampaigns } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductInteractions } from "./_components/product-interactions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/context/wishlist-context";
import { useUser } from "@/context/user-context";
import { useAuthDialog } from "@/context/auth-dialog-context";
import { useMemo } from "react";


const ProductCard = dynamic(() => import('@/components/product-card').then(mod => mod.ProductCard), {
  loading: () => <div className="flex flex-col space-y-3">
      <Skeleton className="h-[225px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
       <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-2/4" />
      </div>
    </div>,
});

const FrequentlyBoughtTogether = dynamic(() => import('./_components/frequently-bought-together-preview').then(mod => mod.FrequentlyBoughtTogetherPreview), {
    loading: () => <Skeleton className="h-[200px] w-full rounded-xl" />
});

const CustomerReviews = dynamic(() => import('./_components/reviews-preview').then(mod => mod.ReviewsPreview), {
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />
});

function ProductPageCampaignBanner() {
    const bannerCampaign = mockCampaigns.find(c => c.status === 'Active' && c.placement === 'product-page-banner');
    if (!bannerCampaign || !bannerCampaign.creatives || bannerCampaign.creatives.length === 0) {
        return null;
    }
    const creative = bannerCampaign.creatives[0];

    return (
        <div className="bg-accent/20 border border-accent rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 my-8">
            <div className="relative w-full md:w-24 h-32 md:h-24 rounded-md overflow-hidden flex-shrink-0">
                {creative.imageUrl && <Image src={creative.imageUrl} alt={creative.title} fill className="object-cover" />}
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold">{creative.title}</h3>
                <p className="text-sm text-muted-foreground">{creative.description}</p>
            </div>
            <Button asChild><Link href={`/products?campaign=${bannerCampaign.id}`}>{creative.cta}</Link></Button>
        </div>
    );
}

export default function ProductDetailPage() {
  const { toast } = useToast();
  const params = useParams();
  const id = params.id as string;
  const product = mockProducts.find((p) => p.id === id);

  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isLoggedIn } = useUser();
  const { openDialog } = useAuthDialog();
  
  const isCustomizable = useMemo(() => {
    if (!product) return false;
    // A product is customizable if it has any defined customization areas on any side.
    return Object.values(product.customizationAreas || {}).some(areas => areas && areas.length > 0);
  }, [product]);

  if (!product) {
    notFound();
  }
  
  const similarProducts = mockProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleWishlistClick = () => {
      if (!isLoggedIn) {
          openDialog('login');
          return;
      }
      toggleWishlist(product);
      toast({
          title: isWishlisted(product.id) ? "Removed from Wishlist" : "Added to Wishlist",
          description: product.name,
      });
  }

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority data-ai-hint={`${product.tags?.[0] || 'product'} ${product.tags?.[1] || ''}`} />
             <Button 
                size="icon" 
                variant="secondary" 
                className="absolute top-4 right-4 rounded-full h-10 w-10"
                onClick={handleWishlistClick}
              >
                <Heart className={cn("h-5 w-5", isWishlisted(product.id) && "fill-destructive text-destructive")} />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-sm font-medium text-primary">{product.category}</p>
          <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn('h-5 w-5', i < Math.round(product.rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30')} />
              ))}
            </div>
            <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          <p className="text-3xl font-bold font-body">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <ProductInteractions product={product} isCustomizable={isCustomizable} />
        </div>
      </div>
      
      <ProductPageCampaignBanner />

      <Separator className="my-12" />

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <CustomerReviews />
        </div>
        
        <div className="space-y-8">
            <FrequentlyBoughtTogether />
        </div>
      </div>

      <Separator className="my-12" />

      <div>
        <h2 className="text-2xl font-bold font-headline mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}



"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Copy, Gift, Percent, Users, CheckCircle, Clock, Share2, MessageCircle, Send, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";


// This data would come from a backend API call for the logged-in vendor
const MOCK_VENDOR_DATA = {
    referralCode: "VENDOR-A1B2",
    isReferredVendor: true, // This vendor was referred by someone else
    referrals: 3,
    referralsNeededForBonus: 5,
    ordersWithDiscount: 0, 
    onboardingDiscount: {
        isActive: true,
        discount: 2, // 2%
        expires: "3 months"
    },
    referralDiscount: {
        isActive: false,
        discount: 0.75, // 0.75% because they were referred, will become 1% total
    }
};

MOCK_VENDOR_DATA.referralDiscount.discount = MOCK_VENDOR_DATA.isReferredVendor ? 0.75 : 1.0;
const totalCommissionDiscount = (MOCK_VENDOR_DATA.onboardingDiscount.isActive ? MOCK_VENDOR_DATA.onboardingDiscount.discount : 0) + (MOCK_VENDOR_DATA.referralDiscount.isActive ? MOCK_VENDOR_DATA.referralDiscount.discount : 0);
const cappedTotalDiscount = Math.min(totalCommissionDiscount, 3);

function ShareDialog() {
    const { toast } = useToast();
    const referralCode = MOCK_VENDOR_DATA.referralCode;
    const shareUrl = "https://shopsphere.example.com/signup?ref=vendor"; // A more specific URL

    // Platform-specific messages for vendors
    const genericText = `Join our community of vendors on ShopSphere! Use my code to get special onboarding benefits: ${referralCode}`;
    const fullMessage = `${genericText}\n\nSign up here: ${shareUrl}`;
    const twitterText = `Looking to sell your products online? Join me on @ShopSphere. Use my referral code ${referralCode} to get a great start. #sellonline #ecommerce`;
    const linkedinTitle = "Opportunity for Vendors: Join ShopSphere Marketplace";
    const linkedinSummary = `I've had a positive experience selling my products on ShopSphere and wanted to extend an invitation. It's a great platform to reach new customers. They have a referral program that gives new vendors a commission discount to start. Use my code if you decide to sign up: ${referralCode}`;

    const copyShareMessage = () => {
        navigator.clipboard.writeText(fullMessage);
        toast({ title: 'Copied!', description: 'Share message copied to clipboard.' });
    }

    const socialLinks = [
        { name: 'WhatsApp', icon: MessageCircle, url: `https://wa.me/?text=${encodeURIComponent(fullMessage)}` },
        { name: 'Telegram', icon: Send, url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(genericText)}` },
        { name: 'Twitter', icon: Twitter, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}` },
        { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(genericText)}` },
        { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(linkedinTitle)}&summary=${encodeURIComponent(linkedinSummary)}` },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="rounded-l-none">
                    <Share2 className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Your Referral Code</DialogTitle>
                    <DialogDescription>
                        Invite other vendors to join ShopSphere and earn rewards when they sign up.
                    </DialogDescription>
                </DialogHeader>
                 <div className="flex flex-col space-y-2">
                    <Label htmlFor="share-message" className="text-sm font-medium">Share Message</Label>
                    <Textarea id="share-message" value={fullMessage} readOnly rows={4} className="resize-none" />
                    <Button type="button" size="sm" className="w-full" onClick={copyShareMessage}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Message
                    </Button>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground text-center">Or share directly</p>
                <div className="flex justify-center gap-2">
                    {socialLinks.map(social => (
                         <Button key={social.name} variant="outline" size="icon" asChild>
                            <a href={social.url} target="_blank" rel="noopener noreferrer">
                                <social.icon className="h-5 w-5" />
                                <span className="sr-only">Share on {social.name}</span>
                            </a>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function VendorReferralsPage() {
    const referralProgress = (MOCK_VENDOR_DATA.referrals / MOCK_VENDOR_DATA.referralsNeededForBonus) * 100;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Referrals & Rewards</h1>
                <p className="text-muted-foreground">Track your referral progress and see your active rewards.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-primary"/> Vendor Referral Program</CardTitle>
                            <CardDescription>Refer other vendors to earn discounts on your commission fees.</CardDescription>
                        </CardHeader>
                         <CardContent className="space-y-4">
                             <div>
                                <p className="text-sm text-muted-foreground mb-2">Share your code with other potential vendors. For every 5 new vendors that sign up and get verified, you'll receive a {MOCK_VENDOR_DATA.referralDiscount.discount}% discount on your commission for your next 8 orders!</p>
                                 <div className="flex">
                                    <Input value={MOCK_VENDOR_DATA.referralCode} readOnly className="rounded-r-none focus:ring-0 focus:ring-offset-0"/>
                                    <ShareDialog />
                                </div>
                            </div>
                            <Separator />
                             <div>
                                <Progress value={referralProgress} />
                                 <p className="text-sm text-muted-foreground text-center mt-2">
                                    You have <span className="font-bold text-primary">{MOCK_VENDOR_DATA.referrals}</span> successful referrals. You're <span className="font-bold text-primary">{MOCK_VENDOR_DATA.referralsNeededForBonus - MOCK_VENDOR_DATA.referrals}</span> away from your next reward!
                                </p>
                             </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Your Active Rewards</CardTitle>
                            <CardDescription>All your currently active bonuses and discounts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {MOCK_VENDOR_DATA.onboardingDiscount.isActive && (
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">New Vendor Bonus</p>
                                        <p className="text-xs text-muted-foreground">{MOCK_VENDOR_DATA.onboardingDiscount.discount}% commission discount for your first {MOCK_VENDOR_DATA.onboardingDiscount.expires}.</p>
                                    </div>
                                </div>
                            )}
                             {MOCK_VENDOR_DATA.referralDiscount.isActive && (
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Gift className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Referral Bonus</p>
                                        <p className="text-xs text-muted-foreground">{MOCK_VENDOR_DATA.referralDiscount.discount}% commission discount for your next {MOCK_VENDOR_DATA.ordersWithDiscount} orders.</p>
                                    </div>
                                </div>
                             )}

                             <Separator />

                             <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
                                <p className="text-sm font-medium text-primary-foreground/80">Total Commission Discount</p>
                                 <p className="text-3xl font-bold text-primary">{cappedTotalDiscount.toFixed(2)}%</p>
                                 <p className="text-xs text-muted-foreground">(Capped at 3% maximum)</p>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


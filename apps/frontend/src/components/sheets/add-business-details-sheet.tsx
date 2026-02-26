import { Button } from '@/components/ui/button';
import {
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { X, Briefcase, MapPin, Phone } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBusiness } from '@/hooks/form/use-business';
import { useUserBusiness } from '@/store';

interface Props {
    onSuccess: () => void;
}

export function AddBusinessDetailsSheet({ onSuccess } : Props) {
    const { form, handleFormSubmit } = useBusiness( { onSuccess });
    const { loading } = useUserBusiness();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="bg-card text-foreground rounded-t-3xl flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <SheetTitle className="text-lg font-semibold">Add Your Business Details</SheetTitle>
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </SheetClose>
                    </div>
                </SheetHeader>
                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input 
                                            placeholder="e.g., Aunty Funke's Textiles"
                                            className="pl-10"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                           <FormItem>
                             <FormLabel>Business Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl>
                                  <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Select business category" />
                                    </SelectTrigger>
                                  </div>
                               </FormControl>
                               <SelectContent>
                                 <SelectItem value="textiles">Textiles & Apparel</SelectItem>
                                 <SelectItem value="electronics">Consumer Electronics</SelectItem>
                                 <SelectItem value="manufacturing">Artisanal Manufacturing</SelectItem>
                                 <SelectItem value="agriculture">Agriculture</SelectItem>
                                 <SelectItem value="other">Other</SelectItem>
                               </SelectContent>
                             </Select>
                             <FormMessage />
                           </FormItem>
                        )}
                      />
                     <FormField
                        control={form.control}
                        name="street_address"
                        render={({ field }) => (
                           <FormItem>
                             <FormLabel>Business Location</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                     <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Select primary market" />
                                     </SelectTrigger>
                                </div>
                               </FormControl>
                               <SelectContent>
                                 <SelectItem value="lagos">Lagos (Balogun, etc.)</SelectItem>
                                 <SelectItem value="onitsha">Onitsha (Main Market)</SelectItem>
                                 <SelectItem value="aba">Aba (Ariaria, etc.)</SelectItem>
                                 <SelectItem value="kano">Kano (Kantin Kwari, etc.)</SelectItem>
                                 <SelectItem value="other">Other</SelectItem>
                               </SelectContent>
                             </Select>
                             <FormMessage />
                           </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input 
                                            type="tel"
                                            placeholder="e.g., 08012345678"
                                            className="pl-10"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <SheetFooter className="p-6 border-t mt-auto">
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save and Continue"}
                    </Button>
                </SheetFooter>
            </form>
        </Form>
    );
}

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface SchemeProps {
  name: string;
  description: string;
  benefit: string;
  source: string;
}

export const SchemeCard = ({ name, description, benefit, source }: SchemeProps) => {
  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-md transition-shadow duration-200 border-primary/10">
      <CardHeader>
        <CardTitle className="text-xl font-heading text-primary">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Benefit</h4>
            <p className="text-foreground font-medium">{benefit}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full group"
          onClick={() => window.open(source, "_blank", "noopener,noreferrer")}
        >
          View Source
          <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

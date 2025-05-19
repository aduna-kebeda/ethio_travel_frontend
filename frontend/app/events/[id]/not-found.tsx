import Link from "next/link"
import { Button } from "@/components/ui/button"
import Container from "@/components/container"

export default function EventNotFound() {
  return (
    <Container className="py-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Event Not Found</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/events">Browse All Events</Link>
        </Button>
      </div>
    </Container>
  )
}

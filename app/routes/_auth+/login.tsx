import { Link } from '@remix-run/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '~/components/ui/card'

export default function LoginRoute () {

    return (
        <div className="container max-w-lg md:mt-10">
            <Card

            >
                <CardHeader>
                    <CardDescription>

                    </CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
                <CardFooter>
                    <Link to="/register">Register</Link>
                    <Link to="/login"> Login </Link>
                </CardFooter>
            </Card>
            </div>
    )
}

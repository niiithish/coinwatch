import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signInAction } from "@/app/actions/auth"

const LoginForm = () => {
    return (
        <Card className="ring-0 flex flex-col gap-6 w-full max-w-[350px] justify-center bg-transparent">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={signInAction}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                            />
                        </Field>
                        <Field>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password" >Password</FieldLabel>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </Field>
                        <Field>
                            <Button type="submit">Login</Button>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
export default LoginForm;

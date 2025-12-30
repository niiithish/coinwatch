"use client";

import { cn } from "@/lib/utils"
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
import { signUpAction } from "@/app/actions/auth"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import countries from "world-countries"

// Create a lookup map for flags to keep the render fast
const countryMap = new Map(
    countries.map((c) => [c.name.common, { flag: c.flag, code: c.cca3 }])
);

// Just a sorted list of names for the search engine
const countryNames = Array.from(countryMap.keys()).sort();

const SignUpForm = () => {

    return (
        <Card className="ring-0 bg-transparent w-full max-w-[350px]">
            <CardHeader>
                <CardTitle>Sign Up to your account</CardTitle>
                <CardDescription>
                    Enter your email below to Sign Up to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={signUpAction}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                            />
                        </Field>
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
                            <FieldLabel htmlFor="password" >Password</FieldLabel>
                            <Input id="password" name="password" type="password" required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="country" >Country</FieldLabel>
                            <Combobox items={countryNames}>
                                <ComboboxInput
                                    name="country"
                                    placeholder="Select Country"
                                    required
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>No country found.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(name: string) => {
                                            const data = countryMap.get(name);
                                            return (
                                                <ComboboxItem key={data?.code} value={name}>
                                                    <span className="flex items-center gap-2">
                                                        <span>{data?.flag}</span>
                                                        <span>{name}</span>
                                                    </span>
                                                </ComboboxItem>
                                            );
                                        }}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </Field>
                        <Field>
                            <Button type="submit">Sign Up</Button>
                            <FieldDescription className="text-center">
                                Already have an account? <Link href="/login">Login</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default SignUpForm;
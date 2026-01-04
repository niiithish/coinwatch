"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddIcon } from "@hugeicons/core-free-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import { saveAlert } from "@/lib/alerts";
import { toast } from "sonner";

interface CreateAlertDialogProps {
    coinId?: string;
    coinName?: string;
    coinSymbol?: string;
}

const alertTypeItems = [
    { label: "Price", value: "price" },
    { label: "Percentage Change", value: "percentage_change" },
    { label: "Volume", value: "volume" },
    { label: "Market Cap", value: "market_cap" },
];

const conditionItems = [
    { label: "Greater than (>)", value: "greater_than" },
    { label: "Less than (<)", value: "less_than" },
    { label: "Equal to (=)", value: "equal_to" },
    { label: "Greater than or equal (≥)", value: "greater_than_or_equal" },
    { label: "Less than or equal (≤)", value: "less_than_or_equal" },
];

const frequencyItems = [
    { label: "Once", value: "once" },
    { label: "Once per day", value: "once_per_day" },
    { label: "Every time", value: "every_time" },
];

const CreateAlertDialog = ({
    coinId = "unknown",
    coinName = "Unknown Coin",
    coinSymbol = "???"
}: CreateAlertDialogProps) => {
    const [alertName, setAlertName] = useState("");
    const [thresholdValue, setThresholdValue] = useState("");
    const [open, setOpen] = useState(false);

    // Use refs to track select values since base-ui Select doesn't have controlled state
    const alertTypeRef = useRef("price");
    const conditionRef = useRef("greater_than");
    const frequencyRef = useRef("once_per_day");

    const resetForm = () => {
        setAlertName("");
        setThresholdValue("");
        alertTypeRef.current = "price";
        conditionRef.current = "greater_than";
        frequencyRef.current = "once_per_day";
    };

    const handleCreateAlert = () => {
        // Validate required fields
        if (!alertName.trim()) {
            toast.error("Please enter an alert name");
            return;
        }

        if (!thresholdValue.trim()) {
            toast.error("Please enter a threshold value");
            return;
        }

        // Save alert to localStorage
        const newAlert = saveAlert({
            alertName: alertName.trim(),
            coinId,
            coinName,
            coinSymbol,
            alertType: alertTypeRef.current,
            condition: conditionRef.current,
            thresholdValue: thresholdValue.trim(),
            frequency: frequencyRef.current,
        });

        toast.success(`Alert "${newAlert.alertName}" created successfully!`);

        // Reset form and close dialog
        resetForm();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex items-center gap-1 bg-primary rounded-sm py-1 px-2 text-xs font-medium text-foreground cursor-pointer">
                <HugeiconsIcon icon={AddIcon} size={14} />
                Create Alert
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                {/* Header */}
                <DialogTitle className="text-lg font-bold text-foreground">
                    Price Alert
                </DialogTitle>

                {/* Form Content */}
                <div className="flex flex-col gap-5 mt-2">
                    {/* Alert Name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="alert-name" className="text-muted-foreground text-xs">
                            Alert Name
                        </Label>
                        <Input
                            id="alert-name"
                            placeholder="Bitcoin at Discount"
                            value={alertName}
                            onChange={(e) => setAlertName(e.target.value)}
                            className="h-10 bg-[#1a1f2e] border-primary/50 focus-visible:border-primary text-sm"
                        />
                    </div>

                    {/* Coin Name */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-xs">
                            Coin Name
                        </Label>
                        <div className="h-10 flex items-center px-3 bg-[#1a1f2e] rounded-md border border-input text-sm text-muted-foreground">
                            {coinName} ({coinSymbol})
                        </div>
                    </div>

                    {/* Alert Type */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-xs">
                            Alert type
                        </Label>
                        <Select
                            defaultValue="price"
                            items={alertTypeItems}
                            onValueChange={(value) => { alertTypeRef.current = value as string; }}
                        >
                            <SelectTrigger className="h-10 w-full bg-[#1a1f2e] border-input text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {alertTypeItems.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Condition */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-xs">
                            Condition
                        </Label>
                        <Select
                            defaultValue="greater_than"
                            items={conditionItems}
                            onValueChange={(value) => { conditionRef.current = value as string; }}
                        >
                            <SelectTrigger className="h-10 w-full bg-[#1a1f2e] border-input text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {conditionItems.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Threshold Value */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="threshold-value" className="text-muted-foreground text-xs">
                            Threshold value
                        </Label>
                        <InputGroup className="h-10 bg-[#1a1f2e]">
                            <InputGroupAddon align="inline-start">
                                <InputGroupText className="text-primary font-medium">$</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                id="threshold-value"
                                placeholder="eg: 140"
                                value={thresholdValue}
                                onChange={(e) => setThresholdValue(e.target.value)}
                                className="text-sm"
                                type="number"
                            />
                        </InputGroup>
                    </div>

                    {/* Frequency */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-xs">
                            Frequency
                        </Label>
                        <Select
                            defaultValue="once_per_day"
                            items={frequencyItems}
                            onValueChange={(value) => { frequencyRef.current = value as string; }}
                        >
                            <SelectTrigger className="h-10 w-full bg-[#1a1f2e] border-input text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {frequencyItems.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Create Alert Button */}
                    <Button
                        onClick={handleCreateAlert}
                        className="w-full h-11 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
                    >
                        Create Alert
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAlertDialog;
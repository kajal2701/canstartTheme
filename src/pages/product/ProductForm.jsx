import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { useNavigate } from "react-router-dom";
import { getColors } from "../../services/quoteService";

const typeOptions = [
    { value: "1", label: "Controller" },
    { value: "2", label: "Channel" },
];

const ProductForm = ({ methods, onSubmit, title, submitText }) => {
    const navigate = useNavigate();
    const [colorOptions, setColorOptions] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue, clearErrors
    } = methods;

    const selectedType = watch("type");
    const isChannel = selectedType === "2";

    useEffect(() => {
        if (!isChannel) {
            setValue("channel_color", "");     // ← reset value
            clearErrors("channel_color");      // ← clear any existing error
        }
    }, [isChannel])

    // ── Fetch colors ─────────────────────────────────────────────────
    useEffect(() => {
        const loadColors = async () => {
            try {
                const rows = await getColors();
                console.log("colors raw:", rows); // ← check what you actually get

                if (Array.isArray(rows)) {
                    const mapped = rows.map((c) => ({
                        value: String(c.color_id),   // ← convert to string for select value
                        label: c.color_name,
                    }));
                    setColorOptions(mapped);
                } else {
                    setColorOptions([]);
                }
            } catch (e) {
                console.error("Failed to load colors", e);
                setColorOptions([]);
            }
        };
        loadColors();
    }, []);
    // ────────────────────────────────────────────────────────────────

    return (
        <Card title={title}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-5">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">

                            {/* Title */}
                            <Textinput
                                label="Title"
                                type="text"
                                placeholder="Title"
                                name="title"
                                register={register}
                                error={errors.title}
                                options={{ required: "Title is required" }}
                            />

                            {/* SKU */}
                            <Textinput
                                label="SKU"
                                type="text"
                                placeholder="SKU"
                                name="sku"
                                register={register}
                                error={errors.sku}
                                options={{ required: "SKU is required" }}
                            />

                            {/* Description — full width */}
                            <div className="lg:col-span-2 col-span-1">
                                <Textarea
                                    label="Description"
                                    placeholder="Description"
                                    rows="3"
                                    name="description"
                                    register={register}
                                    error={errors.description}
                                    options_rule={{ required: "Description is required" }}
                                />
                            </div>

                            {/* Inventory */}
                            <Textinput
                                label="Inventory"
                                type="number"
                                placeholder="Inventory"
                                name="inventory"
                                register={register}
                                error={errors.inventory}
                                options={{
                                    required: "Inventory is required",
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Inventory cannot be negative" },
                                }}
                                onKeyPress={(e) => {
                                    // ← only allow integers (ASCII 48-57)
                                    if (e.charCode < 48 || e.charCode > 57) e.preventDefault();
                                }}
                            />

                            {/* Price */}
                            <Textinput
                                label="Price"
                                type="number"
                                placeholder="Price"
                                name="price"
                                register={register}
                                error={errors.price}
                                options={{
                                    required: "Price is required",
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Price cannot be negative" },
                                }}
                                step="0.01"  // ← allows decimals/cents
                            />

                            {/* Type */}
                            <Select
                                label="Type"
                                name="type"
                                placeholder="-- Select Type --"
                                options={typeOptions}
                                register={register}
                                error={errors.type}
                                options_rule={{ required: "Type is required" }}
                            />

                            {/* Color — only visible when Channel (2) is selected */}
                            {isChannel && (
                                <Select
                                    label="Color"
                                    name="channel_color"
                                    placeholder="--Select color--"
                                    options={colorOptions}
                                    register={register}
                                    error={errors.channel_color}
                                    options_rule={{ required: "Color is required for Channel type" }}
                                />
                            )}

                        </div>

                        <div className="ltr:text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                            <Button
                                text="Cancel"
                                type="button"
                                className="btn-outline-dark btn-sm"
                                onClick={() => navigate("/product")}
                            />
                            <Button
                                text={submitText}
                                type="submit"
                                className="btn-primary btn-sm"
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Card>
    );
};

export default ProductForm;
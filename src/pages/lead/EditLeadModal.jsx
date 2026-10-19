import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { updateLead } from "@/services/leadService";
import { toast } from "react-toastify";

const EditLeadModal = ({ activeModal, onClose, leadData, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      note: "",
    },
  });

  // Pre-fill form when modal opens with lead data
  useEffect(() => {
    if (activeModal && leadData) {
      reset({
        name: leadData.name !== "-" ? leadData.name : "",
        phone: leadData.phone !== "-" ? leadData.phone : "",
        address: leadData.address !== "-" ? leadData.address : "",
        note: leadData.note !== "-" ? leadData.note : "",
      });
    }
  }, [activeModal, leadData, reset]);

  const onSubmit = async (data) => {
    try {
      const result = await updateLead({
        lead_id: leadData.id,
        ...data,
      });

      if (result.success) {
        toast.success(result.message);
        onClose();
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error("Failed to update lead");
    }
  };

  return (
    <Modal
      activeModal={activeModal}
      onClose={onClose}
      className="max-w-md"
      title="Edit Lead"
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Textinput
          label="Name"
          type="text"
          placeholder="Enter name"
          name="name"
          register={register}
          error={errors.name}
          options={{ required: "Name is required" }}
        />

        <Textinput
          label="Phone"
          type="tel"
          placeholder="Enter phone number"
          name="phone"
          register={register}
          error={errors.phone}
          options={{
            required: "Phone number is required",
            pattern: {
              value: /^[+]?[\d\s\-().]{7,15}$/,
              message: "Please enter a valid phone number",
            },
          }}
        />

        <Textarea
          label="Address"
          placeholder="Enter address"
          name="address"
          register={register}
          error={errors.address}
          row={2}
        />

        <Textarea
          label="Note"
          placeholder="Enter any notes..."
          name="note"
          register={register}
          error={errors.note}
          row={2}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            text="Cancel"
            className="btn-outline-dark btn-sm"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            text={isSubmitting ? "Saving..." : "Save Changes"}
            className="btn-primary btn-sm"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditLeadModal;

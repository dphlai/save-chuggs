import { useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps;

const validateForm = (text: string): string | null => {
  if (!text.trim()) {
    return "Insight must be... insightful! Empty spaces are not insightful. 👹";
  }

  // TODO: Additional validation based on business rules
  // if (text.trim().length > 500) {
  //   return "Insight must be less than 500 characters. Are you writing a novel?";
  // }
  
  return null;
};

const createInsight = async (brand: number, text: string) => {
  const response = await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand, text: text.trim() }),
  });
  
  //TODO: Add more specific error handling, e.g. 400, 500
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  
  return response;
};

export const AddInsight = (props: AddInsightProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const addInsight = async (event: React.FormEvent) => {
    // Prevent page reload on submit
    event.preventDefault();

    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const brand = Number(formData.get("brand"));
    const text = formData.get("text") as string;
    
    // Validate
    const validationError = validateForm(text);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    // Submit
    try {
      await createInsight(brand, text);
      props.onClose?.();
      globalThis.location.reload();
    } catch (error) {
      console.error("Failed to create insight:", error);
      alert("Failed to create insight. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          <select 
          className={styles["field-input"]} 
          name="brand"
          disabled={isLoading}
          >
            // Bugfix:resolve console error Each child in a list should have a unique "key" prop.
            {BRANDS.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            name="text"
            disabled={isLoading}
          />
        </label>
        <Button 
        className={styles.submit} 
        type="submit" 
        label={isLoading ? "Adding insight..." : "Add insight"} 
        disabled={isLoading}
        />
      </form>
    </Modal>
  );
};

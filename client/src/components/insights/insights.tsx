import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { cx } from "../../lib/cx.ts";
import { Modal } from "../modal/modal.tsx";
import { Button } from "../button/button.tsx";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  insights: Insight[];
  className?: string;
};

type DeleteConfirmState = {
  id: number;
  show: boolean;
};

const deleteInsightHelper = async (id: number) => {
  const response = await fetch(`/api/insights/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  
  return response;
};

const handleDeleteError = (error: unknown) => {
  console.error("Failed to delete insight:", error);
  alert("Failed to delete insight. Please try again.");
};

export const Insights = ({ insights, className }: InsightsProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({id: 0, show: false});

  const deleteInsight = (id: number) => {
    // Show confirmation modal instead of blocking confirm dialog
    setDeleteConfirm({id, show: true});
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteInsightHelper(deleteConfirm.id);
      setDeleteConfirm({id: 0, show: false});
      globalThis.location.reload();
    } catch (error) {
      handleDeleteError(error);
    }
  };

  return (
    <div className={cx(className)}>
      {/* Delete confirmation modal */}
      {deleteConfirm.show && (
        <Modal open={deleteConfirm.show} onClose={() => setDeleteConfirm({id: 0, show: false})}>
          <h2>Delete Insight?</h2>
          <p>This action cannot be undone.</p>
          <div className={styles["modal-actions"]}>
            <Button 
              label="Delete"
              onClick={handleConfirmDelete}
            />
            <Button 
              label="Cancel"
              onClick={() => setDeleteConfirm({id: 0, show: false})}
            />
          </div>
        </Modal>
      )}
      
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brand }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>Brand: {brand}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{new Date(createdAt).toString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() => deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};

import { ToastData } from '../hooks/useToast';

interface Props {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

export const ToastContainer = ({ toasts, removeToast }: Props) => {
  return (
    <div className="toast-container" data-testid="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast"
          style={{
            borderLeftColor:
              toast.type === 'success' ? 'var(--green)' :
              toast.type === 'error'   ? 'var(--r)' :
              toast.type === 'warning' ? 'var(--amber)' : 'var(--r)',
          }}
          onClick={() => removeToast(toast.id)}
          data-testid={`toast-${toast.id}`}
        >
          <div style={{ fontWeight: 700, marginBottom: toast.description ? 4 : 0 }}>
            {toast.title}
          </div>
          {toast.description && (
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>
              {toast.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

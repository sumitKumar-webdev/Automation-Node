import { memo, useEffect, useState } from 'react';
import { Handle } from 'reactflow';
import { X } from 'lucide-react';
import { useStore } from '../../store';

const resolveFieldDefault = (field, { id, data }) => {
  if (data && data[field.key] !== undefined) {
    return data[field.key];
  }
  if (typeof field.defaultValue === 'function') {
    return field.defaultValue({ id, data });
  }
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }
  if (field.type === 'checkbox') {
    return false;
  }
  return '';
};

export const NodeShell = ({
  nodeId, title, subtitle, icon: Icon, keyColor, handles, children, className, style,
}) => {
  const removeNode = useStore((state) => state.removeNode);
  const [deleteSetup, setDeleteSetup] = useState(false);

  useEffect(() => {
    if (!deleteSetup) return undefined;
    const timerId = window.setTimeout(() => setDeleteSetup(false), 2000);
    return () => window.clearTimeout(timerId);
  }, [deleteSetup]);

  return (
    <div
      className={`node-shell${className ? ` ${className}` : ''}`}
      style={{
        ...style,
        '--node-key-color': keyColor ?? '#d1d5db',
        '--node-bg-color': `color-mix(in srgb, ${keyColor ?? '#d1d5db'} 20%, white)`,
      }}
    >
      {nodeId && (
        <button
          className={`node-remove-button${deleteSetup ? ' is-armed' : ''}`}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (deleteSetup) {
              removeNode(nodeId);
              return;
            }
            setDeleteSetup(true);
          }}
          aria-label={`Remove ${title} node`}
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
      {handles?.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            width: 12,
            height: 12,
            background: '#ffffff',
            border: '2px solid var(--node-key-color, #d1d5db)',
            transition: 'border-color 160ms ease, box-shadow 160ms ease',
            ...(handle.offset !== undefined && {
              top: `${handle.offset}%`,
              transform: 'translateY(-50%)',
            }),
            ...handle.style,
          }}
        />
      ))}
      <div className="node-heading">
        <div className="node-title-row">
          {Icon ? <Icon className="node-title-icon" size={14} strokeWidth={2.2} /> : null}
          <div className="node-title">{title}</div>
        </div>
        {subtitle && <div className="node-subtitle">{subtitle}</div>}
      </div>
      <div className="node-body">{children}</div>
    </div>
  );
};


export const NodeField = memo(function NodeField({ field, value, onChange }) {
  const { key: fieldKey, type = 'text', label, placeholder, options = [], rows = 3, helpText, disabled, required } = field;

  const baseProps = {
    id: `field-${fieldKey}`,
    name: fieldKey,
    onChange,
    disabled,
    required,
  };
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select {...baseProps} value={value ?? ''}>
            {options.map(({ value: optValue, label: optLabel }) => (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            {...baseProps}
            value={value ?? ''}
            rows={rows}
            placeholder={placeholder}
          />
        );

      case 'checkbox':
        return (
          <input
            {...baseProps}
            type="checkbox"
            checked={Boolean(value)}
          />
        );

      default:
        return (
          <input
            {...baseProps}
            type={type}
            value={value ?? ''}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className="node-field">
      {label && (
        <label htmlFor={`field-${fieldKey}`} className="node-label">
          {label}
          {required && <span className="node-required">*</span>}
        </label>
      )}

      {renderInput()}

      {helpText && <div className="node-help">{helpText}</div>}
    </div>
  );
});

export const NodeNote = ({ children }) => {
  return <div className="node-note">{children}</div>;
};

export const createConfigNode = (config) => {
  const { title, subtitle, icon, keyColor, handles = [], fields = [], className, content} = config;

  return function ConfigNode({ id, data }) {
    const [values, setValues] = useState(() => {
      return fields.reduce((acc, field) => {
        acc[field.key] = resolveFieldDefault(field, { id, data });
        return acc;
      }, {});
    });

    const handleChange = (field) => (event) => {
      const nextValue = field.type === 'checkbox' ? event.target.checked : event.target.value;
      setValues((prev) => ({ ...prev, [field.key]: nextValue }));
    };

    const resolvedHandles = handles.map((handle) => ({
      ...handle,
      id: `${id}-${handle.id}`,
    }));

    return (
      <NodeShell
        nodeId={id}
        title={title}
        subtitle={subtitle}
        icon={icon}
        keyColor={keyColor}
        handles={resolvedHandles}
        className={className}
      >
        {fields.map((field) => (
          <NodeField
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={handleChange(field)}
          />
        ))}
        {typeof content === 'function' ? content({ values, id, data }) : content}
      </NodeShell>
    );
  };
};

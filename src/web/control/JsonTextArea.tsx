import { useState } from 'react';

interface JsonTextAreaProps {
  validator?: (obj: any) => string | undefined;
  onBlur?: (value: string) => void;
  className?: string;
}

function JsonTextArea({ validator, onBlur, className }: JsonTextAreaProps) {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    if (validator) {
      try {
        const validateError = validator(JSON.parse(value));
        setError(validateError);
        if (!validateError) onBlur?.(value);
      } catch (e) {
        setError((e as Error).message);
      }
    }
  };

  return (
    <div className={className}>
      <textarea
        className="w-full"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default JsonTextArea;

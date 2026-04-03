export interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute?: () => void
  disabled?: boolean
}

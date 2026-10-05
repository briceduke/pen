"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  KeyboardIcon,
  PlayIcon,
  RefreshIcon,
  Share08Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { STARTER_EXAMPLES } from "@/lib/playground/examples"

export interface PlaygroundToolbarProps {
  readonly exampleId: string
  readonly autoRun: boolean
  readonly onSelectExample: (exampleId: string) => void
  readonly onToggleAutoRun: (autoRun: boolean) => void
  readonly onRunPreview: () => void
  readonly onShareUrl: () => void
  readonly onRequestReset: () => void
}

function ShortcutHint({
  keys,
  label,
}: {
  readonly keys: readonly string[]
  readonly label: string
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span>{label}</span>
      <KbdGroup>
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </KbdGroup>
    </div>
  )
}

export function PlaygroundToolbar({
  exampleId,
  autoRun,
  onSelectExample,
  onToggleAutoRun,
  onRunPreview,
  onShareUrl,
  onRequestReset,
}: PlaygroundToolbarProps) {
  return (
    <header className="flex flex-wrap items-center gap-2 border-b bg-card px-3 py-2">
      <div className="flex items-center gap-2 pr-2">
        <HugeiconsIcon icon={SourceCodeIcon} />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Pen</span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            In-browser HTML / CSS / JS
          </span>
        </div>
      </div>

      <Select value={exampleId} onValueChange={onSelectExample}>
        <SelectTrigger size="sm" aria-label="Starter example">
          <SelectValue placeholder="Example" />
        </SelectTrigger>
        <SelectContent align="start" position="popper">
          <SelectGroup>
            {STARTER_EXAMPLES.map((example) => (
              <SelectItem key={example.id} value={example.id}>
                {example.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="hidden h-6 sm:block" />

      <div className="flex items-center gap-2">
        <Switch
          id="auto-run"
          size="sm"
          checked={autoRun}
          onCheckedChange={(checked) => onToggleAutoRun(checked === true)}
        />
        <Label htmlFor="auto-run">Auto-run</Label>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="secondary" size="sm" onClick={onRunPreview}>
              <HugeiconsIcon icon={PlayIcon} data-icon="inline-start" />
              Run
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Run preview <Kbd>⌘</Kbd>
            <Kbd>Enter</Kbd>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="button" variant="outline" size="sm" onClick={onShareUrl}>
              <HugeiconsIcon icon={Share08Icon} data-icon="inline-start" />
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Copy share URL <Kbd>⌘</Kbd>
            <Kbd>S</Kbd>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRequestReset}
            >
              <HugeiconsIcon icon={RefreshIcon} data-icon="inline-start" />
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Reset example <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>R</Kbd>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Shortcuts">
              <HugeiconsIcon icon={KeyboardIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Keyboard</DropdownMenuLabel>
              <DropdownMenuItem disabled>
                <ShortcutHint keys={["⌘", "Enter"]} label="Run" />
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <ShortcutHint keys={["⌘", "S"]} label="Share URL" />
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <ShortcutHint keys={["⌘", "⇧", "R"]} label="Reset" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

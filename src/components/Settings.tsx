import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { invoke } from '@tauri-apps/api/core';
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { toast } from "sonner";
import { useEffect, useState } from "react";
import useSettingsState from "@/state/useSettings";

export default function Settings() {
  const model = useSettingsState(state => state.model);
  const setModel = useSettingsState(state => state.setModel);
  const language = useSettingsState(state => state.language);
  const setLanguage = useSettingsState(state => state.setLanguage);

  const [activeModel, setActiveModel] = useState<Array<string>>([]);
  async function getModelList() {
    try {
      const availableModels: string[] = await invoke("get_model_list");
      if (Array.isArray(availableModels) && availableModels.length > 0) {
        setActiveModel(availableModels);
        if (availableModels.length === 1) {
          setModel(availableModels[0]);
        }
      }
    } catch (e) {
      toast.error(JSON.stringify(e));
    }
  }

  useEffect(() => {
    getModelList();
  }, []);

  return (
    <Popover>
      <PopoverTrigger>Settings</PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">App Settings</h4>
            <p className="text-sm text-muted-foreground">
              Set your preference here.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="targetLanguage">Model</Label>
              <Select value={model} onValueChange={(value) => setModel(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  {
                    activeModel.length > 0 && activeModel.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)
                  }
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="targetLanguage">Target language</Label>
              <Input
                defaultValue={language}
                id="targetLanguage"
                className="col-span-2 h-8"
                onBlur={e => setLanguage(e.target.value)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

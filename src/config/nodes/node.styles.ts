import { Bell, Braces, Circle, Clock, FileText, FunctionSquare, GitFork, Globe, Hourglass, ListChecks, Mail, Repeat, Scale, ShieldCheck, Terminal, ToggleLeft } from "lucide-react";
import { ControlFlowNodeType, IntegrationNodeType, NotificationNodeType, TransformationNodeType, TriggerNodeType, ValidationNodeType } from "../../types/workflow.enums";
import { ActiveMQIcon, ArtemisIcon, KafkaIcon } from "./node.icons";

interface NodeStyleConfig {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}

type NodeStyleRegistry = Record<string, NodeStyleConfig>;

export const NODE_STYLES: NodeStyleRegistry = {
  // Triggers
  [TriggerNodeType.WEBHOOK]: { icon: Bell, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  [TriggerNodeType.CRON]: { icon: Clock, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  [TriggerNodeType.KAFKA]: { icon: KafkaIcon, color: "text-fuchsia-600", bg: "bg-fuchsia-50", border: "border-fuchsia-100" },
  [TriggerNodeType.ACTIVEMQ]: { icon: ActiveMQIcon, color: "text-red-700", bg: "bg-red-50", border: "border-red-100" },

  // Integration
  [IntegrationNodeType.HTTP_CALL]: { icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  [IntegrationNodeType.KAFKA]: { icon: KafkaIcon, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
  [IntegrationNodeType.ARTEMIS_QUEUE]: { icon: ArtemisIcon, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100" },
  [IntegrationNodeType.ACTIVE_MQ]: { icon: ActiveMQIcon, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },

  // Notification
  [NotificationNodeType.EMAIL]: { icon: Mail, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  [NotificationNodeType.LOG]: { icon: FileText, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-100" },
  [NotificationNodeType.CONSOLE]: { icon: Terminal, color: "text-gray-900", bg: "bg-slate-200", border: "border-slate-300" },

  // Transformation
  [TransformationNodeType.JSON_MAPPER]: { icon: Braces, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
  [TransformationNodeType.EXPRESSION]: { icon: FunctionSquare, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },

  // Control Flow
  [ControlFlowNodeType.IF]: { icon: GitFork, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  [ControlFlowNodeType.SWITCH]: { icon: ToggleLeft, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  [ControlFlowNodeType.LOOP]: { icon: Repeat, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
  [ControlFlowNodeType.DELAY]: { icon: Hourglass, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },

  // Validation
  [ValidationNodeType.SCHEMA_CHECK]: { icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  [ValidationNodeType.BUSINESS_RULE]: { icon: Scale, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  [ValidationNodeType.REQUIRED_FIELDS]: { icon: ListChecks, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },

  // Default fallback
  default: { icon: Circle, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-100" },
};

export const getNodeStyle = (nodeType: string): NodeStyleConfig => NODE_STYLES[nodeType] || NODE_STYLES.default;

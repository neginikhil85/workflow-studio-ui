import { Bell, Braces, Clock, FileText, FunctionSquare, GitFork, Globe, Hourglass, ListChecks, Mail, Repeat, Scale, ShieldCheck, Terminal, ToggleLeft } from "lucide-react";
import { ActiveMQIcon, ArtemisIcon, KafkaIcon } from "../../config/nodes/node.icons";
import { ControlFlowNodeType, IntegrationNodeType, NotificationNodeType, TransformationNodeType, TriggerNodeType, ValidationNodeType, WorkflowNodeCategory } from "../../types/workflow.enums";

export interface SidebarItem {
  label: string;
  nodeType: string;
  icon: React.ElementType;
  color: string;
}

export interface SidebarSection {
  title: string;
  category: WorkflowNodeCategory;
  items: SidebarItem[];
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Triggers",
    category: WorkflowNodeCategory.TRIGGER,
    items: [
      { label: "Webhook", nodeType: TriggerNodeType.WEBHOOK, icon: Bell, color: "text-blue-600" },
      { label: "Cron Schedule", nodeType: TriggerNodeType.CRON, icon: Clock, color: "text-violet-600" },
    ],
  },
  {
    title: "Integration",
    category: WorkflowNodeCategory.INTEGRATION,
    items: [
      { label: "HTTP Request", nodeType: IntegrationNodeType.HTTP_CALL, icon: Globe, color: "text-emerald-600" },
      { label: "Kafka", nodeType: IntegrationNodeType.KAFKA, icon: KafkaIcon, color: "text-violet-800" },
      { label: "Artemis Queue", nodeType: IntegrationNodeType.ARTEMIS_QUEUE, icon: ArtemisIcon, color: "text-pink-600" },
      { label: "ActiveMQ", nodeType: IntegrationNodeType.ACTIVE_MQ, icon: ActiveMQIcon, color: "text-orange-600" },
    ],
  },
  {
    title: "Notification",
    category: WorkflowNodeCategory.NOTIFICATION,
    items: [
      { label: "Send Email", nodeType: NotificationNodeType.EMAIL, icon: Mail, color: "text-orange-600" },
      { label: "Log", nodeType: NotificationNodeType.LOG, icon: FileText, color: "text-gray-600" },
      { label: "Console", nodeType: NotificationNodeType.CONSOLE, icon: Terminal, color: "text-gray-900" },
    ],
  },
  {
    title: "Transformation",
    category: WorkflowNodeCategory.TRANSFORMATION,
    items: [
      { label: "JSON Mapper", nodeType: TransformationNodeType.JSON_MAPPER, icon: Braces, color: "text-indigo-600" },
      { label: "Expression", nodeType: TransformationNodeType.EXPRESSION, icon: FunctionSquare, color: "text-indigo-600" },
    ],
  },
  {
    title: "Control Flow",
    category: WorkflowNodeCategory.CONTROL_FLOW,
    items: [
      { label: "If Condition", nodeType: ControlFlowNodeType.IF, icon: GitFork, color: "text-cyan-600" },
      { label: "Switch", nodeType: ControlFlowNodeType.SWITCH, icon: ToggleLeft, color: "text-cyan-600" },
      { label: "Loop", nodeType: ControlFlowNodeType.LOOP, icon: Repeat, color: "text-cyan-600" },
      { label: "Delay", nodeType: ControlFlowNodeType.DELAY, icon: Hourglass, color: "text-amber-600" },
    ],
  },
  {
    title: "Validation",
    category: WorkflowNodeCategory.VALIDATION,
    items: [
      { label: "Schema Check", nodeType: ValidationNodeType.SCHEMA_CHECK, icon: ShieldCheck, color: "text-rose-600" },
      { label: "Business Rule", nodeType: ValidationNodeType.BUSINESS_RULE, icon: Scale, color: "text-rose-600" },
      { label: "Required Fields", nodeType: ValidationNodeType.REQUIRED_FIELDS, icon: ListChecks, color: "text-rose-600" },
    ],
  },
];

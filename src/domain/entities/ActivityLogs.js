const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who performed the action
  action: {
    type: String,
    required: true,
    enum: ["CREATE", "UPDATE", "DELETE"],
  }, // Action type
  entityType: { type: String, required: true }, // e.g., 'Instrument', 'Category', 'Region'
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the entity being modified
  entityName: { type: String, required: true }, // Name/title of the entity
  changes: [
    {
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
    },
  ], // Track field-level changes
  timestamp: { type: Date, default: Date.now }, // When the action occurred
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

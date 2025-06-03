export class TodoEntity {
  constructor(
    public id: number,
    public text: string,
    public completedAt?: Date | null
  ) {}

  get isCompletedAt() {
    return !!this.completedAt;
  }

  public static fromJson(json: { [key: string]: any }): TodoEntity {
    const { id, text, completedAt } = json;
    let newCompletedAt;
    if (!id) throw "Id is required";
    if (!text) throw "text is requiered";
    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (newCompletedAt.toString() === "Invalid Date") {
        throw "completedAt must be a Valid date";
      }
    }

    return new TodoEntity(id, text, completedAt);
  }
}

export class CreateTodoDto {
  private constructor(public readonly text: string) {}

  static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {
    const { text } = props;

    if (!text || text.length === 0)
      return ["Text property is requiered", undefined];

    return [undefined, new CreateTodoDto(text)];
  }
}

export class TestCase {
  public constructor(
    public testCase: string,
    public status: 'failed' | 'passed' | 'waiting',
  ) { }
}

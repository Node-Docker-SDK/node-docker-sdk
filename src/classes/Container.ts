import { Containers } from '../api/Containers.js'
import { jsonEndpoint } from '../DockerAPI.js'
import { definitions } from '../specs/v1.41.js'
import { GetParamType } from '../utils/GetParamType.js'
import { GetResponseType } from '../utils/GetResponseType.js'

export type ContainerSummary = definitions['ContainerSummary']
type Mount = definitions['Mount']
type EndpointSettings = definitions['EndpointSettings']
type Port = definitions['Port']

export class Container implements Required<ContainerSummary> {
  public Command!: string
  public Created!: number
  public HostConfig!: { NetworkMode?: string }
  public Id!: string
  public Image!: string
  public ImageID!: string
  public Labels!: { [p: string]: string }
  public Mounts!: Mount[]
  public Names!: string[]
  public NetworkSettings!: {
    Networks: { [p: string]: EndpointSettings }
  }
  public Ports!: Port[]
  public SizeRootFs!: number
  public SizeRw!: number
  public State!: string
  public Status!: string

  constructor(props: Required<ContainerSummary>) {
    Object.assign(this, props)
  }

  /**
   * Get container by ID
   * @param id Container ID
   */
  static async get(id: string) {
    const containers = await Containers.listContainers({
      filters: JSON.stringify({ id: [id] })
    })
    return containers[0]
  }

  /**
   * Inspect a container
   * @description Return low-level information about a container.
   */
  inspect(query?: GetParamType<'ContainerInspect'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerInspect', 200>>(
      'get',
      `containers/${this.Id}/json`,
      {
        searchParams: query
      }
    )
  }

  /**
   * List processes running inside a container
   * @description On Unix systems, this is done by running the ps command. This endpoint is not supported on Windows.
   */
  top(query?: GetParamType<'ContainerTop'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerTop', 200>>(
      'get',
      `containers/${this.Id}/top`,
      {
        searchParams: query
      }
    )
  }

  /**
   * Remove a container
   * TODO: Add test
   */
  delete(query?: GetParamType<'ContainerDelete'>['query']) {
    return jsonEndpoint<GetResponseType<'ContainerDelete', 204>>(
      'delete',
      `containers/${this.Id}`,
      {
        searchParams: query
      }
    )
  }
}

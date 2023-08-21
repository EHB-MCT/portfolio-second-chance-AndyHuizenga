# OCS Drawing Painting

OCS Drawing Painting is an interactive drawing application that utilizes Node.js, React, Docker, PostgreSQL, and socket.io to create real-time canvas drawings based on incoming OCS data. This project was developed by Andy Huizenga as part of the final work for the Development 5 class.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Requirements](#requirements)
- [Credits](#credits)
- [License](#license)

## Description

OCS Drawing Painting is designed to create dynamic drawings on a canvas using real-time OCS (x, a) coordinate data received from external sources, such as the ZIG SIM app. The application leverages socket.io to establish a connection between the incoming data and the canvas, enabling live updates as new coordinate points are received.

## Features

- Real-time canvas drawing based on incoming OCS (x, a) coordinate data.
- Utilizes Node.js and React for server-side and client-side development.
- Integrated Docker containers for streamlined deployment.
- PostgreSQL database integration for efficient data storage.
- Developed by Andy Huizenga as part of the final work for the Development 5 class.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory and run `npm install` to install the necessary dependencies.
3. Execute the command `docker-compose build` to create the required Docker containers.

## Usage

1. After completing the installation steps, make sure the necessary containers are up and running using Docker.
2. Install a compatible app on your phone, such as the ZIG SIM app, capable of sending OCS data.
3. Configure the app to send x and y coordinate data to the local machine's port 6000.
4. Launch the OCS Drawing Painting application and open the canvas.
5. As the OCS data is received on port 6000, the canvas will display real-time drawings based on the incoming coordinates.

## Requirements

- Node.js
- React
- Docker
- PostgreSQL
- Compatible OCS data source app (e.g., ZIG SIM)
- Web browser with socket.io support

## Credits

This project was developed by Andy Huizenga for the Development 5 class.

Here under are links to pages, videos, website that i have used to get code, error solving and better understanding. 



https://hevodata.com/learn/docker-postgresql/
https://nodejs.org/api/http.html#http_http_request_options_callback
https://koenwoortman.com/tree-command-ignore-node-modules/
https://www.tutorialworks.com/container-networking/
https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/
https://www.nginx.com/blog/deploying-nginx-nginx-plus-docker/
https://www.postgresql.org/
https://stackoverflow.com/questions/30109037/how-can-i-forward-localhost-port-on-my-container-to-localhost-on-my-host
https://stackoverflow.com/questions/67451389/when-to-replace-localhost-with-service-name-in-docker

https://www.youtube.com/watch?v=y_XFIidjtEs
https://www.youtube.com/watch?v=y_XFIidjtEs
https://www.youtube.com/watch?v=dWnxzX_cQGw
https://www.youtube.com/results?search_query=postgresql+pgadmin+4+docker
https://www.youtube.com/watch?v=qECVC6t_2mU
https://www.youtube.com/watch?v=dWnxzX_cQGw
https://www.youtube.com/results?search_query=docker+compose+backend+and+frontend

https://stackoverflow.com/questions/67451389/when-to-replace-localhost-with-service-name-in-docker
https://stackoverflow.com/questions/67451389/when-to-replace-localhost-with-service-name-in-docker
https://stackoverflow.com/questions/17690803/node-js-getaddrinfo-enotfound

https://docs.docker.com/engine/reference/commandline/run/#expose-incoming-ports
https://docs.docker.com/desktop/settings/mac/#proxies

https://chat.openai.com



Feel free to add more details to each section if needed. Let me know if you have any further information or if you'd like to make any more changes!


#Lincense 

MIT License

Copyright (c) [2022] [ANDY HUIZENGA]

## Permissions

- ✅  Commercial use
- ✅  Modification
- ✅  Distribution
- ✅  Private use

## Limitations

- ❌  Liability
- ❌  Warranty

## Conditions

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
2. The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.
3. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.

For the full license text, please see the [LICENSE](LICENSE) file in the root directory of this project.
<?php


class Application_Model_ContactoMapper
{
  /**
   * @var string URi de la api de Alegra.com
   */
  private $_baseUri;
  
  /**
   * @var string Correo registrado en Alegra.com
   */
  private $_email;

  /**
   * @var string Token generado desde la configuracion
   * de Alegra.com
   */
  private $_token;

  /**
   * @var Zend_Http_Client Object cliente para la comunicacion
   */
  private $_client;

  public function __construct()
  {
    // Se obtinen las configuraciones en application.ini
    $dataBootstrap = Zend_Controller_Front::getInstance()->getParam('bootstrap');
    // Se setea las configuraciones de configAlegra en una var
    $dataAlegra = $dataBootstrap->getOption('alegra');
    // Se asigna la URi a una variable privada
    $this->_baseUri = $dataAlegra['uri'];
    // Se asigna el correo para la autentificacion en una variable privada
    $this->_email = $dataAlegra['email'];
    //Se asigna el token para la autentificacion en una variable privada
    $this->_token = $dataAlegra['token'];
    // Se crea una instancia de Zend_Http_Client para su posterior uso
    $this->_client = new Zend_Http_Client();
    // Se setea la URi
    $this->_client->setUri($this->_baseUri);
    // Aumenta el tiempo de espera
    $this->_client->setConfig(array('timeout' => 30));
    // Se setean los datos de autenticacion
    $this->_client->setAuth($this->_email, $this->_token, Zend_Http_Client::AUTH_BASIC);
  }

  /**
   * Metodo para insertar o actualizar un contacto
   * @param {Application_Model_Contacto} contacto
   * @return {object} con la data del contacto o con
   * el error devuelto
   */
  public function upsert(Application_Model_Contacto $contact)
  {
    // Setea el tipo de contacto
    $type = array();
    if ($contact->getIsClient()) {
      $type[] = 'client';
    }
    if ($contact->getIsProvider()) {
      $type[] = 'provider';
    }
    // Setea la direccion del contacto
    $address = (object) [
      'address' => $contact->getAddress(),
      'city' => $contact->getCity(),
    ];

    $params = array(
      'id' => $contact->getId(),
      'name' => $contact->getName(),
      'identification' => $contact->getIdentification(),
      'phonePrimary' => $contact->getPhoneprimary(),
      'phoneSecondary' => $contact->getPhonesecondary(),
      'fax' => $contact->getFax(),
      'mobile' => $contact->getMobile(),
      'observations' => $contact->getObservations(),
      'email' => $contact->getEmail(),
      'priceList' => empty($contact->getPriceList()) ? null : $contact->getPriceList(),
      'seller' => empty($contact->getSeller()) ? null : $contact->getSeller(),
      'term' => empty($contact->getTerm()) ? null : $contact->getTerm(),
      'address' => $address,
      'type' => $type,
      'internalContacts' => $contact->getInternalContacts(),
    );

    if (null === ($id = $contact->getId())) {
      $this->_client->setUri($this->_baseUri);
      $response = $this->_client->setRawData(json_encode($params))->request('POST');
      $data = $response->getBody();
      $data = json_decode($data, true);
    } else {
      $this->_client->setUri($this->_baseUri . "/$id");
      $response = $this->_client->setRawData(json_encode($params))->request('PUT');
      $data = $response->getBody();
      $data = json_decode($data, true);
    }
    return $data;
  }

  /**
   * Metodo para encontrar todos los contactos
   * @param  {string}  type
   * @param  {string}  query
   * @param  {int}     start
   * @param  {int}     limit
   * @param  {string}  orderDirection
   * @param  {string}  orderField
   * @param  {boolean} metadata
   * @return {[object]}  Retorna array of object con la data de los contactos
   */
  public function fetchAll($type = '', $query = '', $start = 0, $limit = 20)
  {
    $params = "?start=$start&limit=$limit&metadata=true";
    if (!empty($type) && in_array($type, array('client', 'provider'))) {
      $params.= "&type=$type";
    }
    if (!empty($query)) {
      $params.= "&query=$query";
    }

    $this->_client->setUri($this->_baseUri . $params);
    $response = $this->_client->request('GET');
    $data = $response->getBody();
    $data = json_decode($data, true);

    if (isset($data['code']) && $data['code'] !== 200) {
      return $data;
    }

    $results = self::_parseData($data['data']);
    $contacts = array();

    foreach ($results as $row) {
      $contact = new Application_Model_Contacto($row);
      $contacts[] = $contact;
    }

    return [
      'total' => $data['metadata']['total'],
      'data' => $contacts,
    ];
  }

  /**
   * Metodo para encontrar todos los contactos
   * @param  {int} id
   * @return {object}  Retorna object con la data del contacto
   */
  public function findById($id)
  {
    $this->_client->setUri($this->_baseUri . "/$id");
    $response = $this->_client->request('GET');

    $data = $response->getBody();
    $data = json_decode($data, true);

    if (isset($data['code']) && $data['code'] !== 200) {
      return $data;
    }

    $result = self::_parseData([$data]);
    $contact = new Application_Model_Contacto($result[0]);

    return [
      'data' => $contact,
    ];
  }

  /**
   * Metodo para eliminar un contacto
   * @param  {int}    id
   * @return {object} Retorna object con mensaje de
   * confirmacion o object con error
   */
  public function delete($id)
  {
    $this->_client->setUri($this->_baseUri . "/$id");
    $response = $this->_client->request('DELETE');
    $data = $response->getBody();
    $data = json_decode($data, true);

    if (isset($data['code']) && $data['code'] !== 200) {
      return $data;
    }

    return $data;
  }

  private function _parseData($data = []) {
    $i = 0;
    foreach ($data as $key => $value) {
      $data[$i]['isClient'] = false;
      $data[$i]['isProvider'] = false;
      if (isset($value['priceList']['id'])) {
        $data[$i]['priceList'] = [$value['priceList']['name']];
      }
      if (isset($value['seller']['id'])) {
        $data[$i]['seller'] = [$value['seller']['name']];
      }
      if (isset($value['term']['id'])) {
        $data[$i]['term'] = [$value['term']['name']];
      }
      if ((isset($value['type'][0]) && 'client' === $value['type'][0]) || (isset($value['type'][1]) && 'client' === $value['type'][1])) {
        $data[$i]['isClient'] = true;
      }
      if ((isset($value['type'][0]) && 'provider' === $value['type'][0]) || (isset($value['type'][1]) && 'provider' === $value['type'][1])) {
        $data[$i]['isProvider'] = true;
      }
      $i++;
    }
    return $data;
  }
}
